import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCardManagementStore } from './store';
import * as sharedLib from '@shared/lib';
import type { IBankCard } from '@entities/bank-card';

vi.mock('@shared/lib', async () => {
  const actualModule = await vi.importActual('@shared/lib');

  return {
    ...(actualModule as Record<string, unknown>),
    initDatabase: vi.fn().mockResolvedValue(undefined),
    getAllCards: vi.fn().mockResolvedValue([
      {
        pan: '5559494202595236',
        expires: '0726',
        name: 'TEST USER',
        cvv: '123',
        pin: '1234',
      },
      {
        pan: '4377723769243191',
        expires: '0726',
        name: 'TEST USER 2',
        cvv: '456',
        pin: '5678',
      },
    ]),
    getCardByPan: vi.fn().mockResolvedValue(undefined),
    checkCardExists: vi.fn().mockResolvedValue(false),
    addCard: vi.fn().mockResolvedValue(undefined),
    updateCard: vi.fn().mockResolvedValue(undefined),
    deleteCard: vi.fn().mockResolvedValue(undefined),
    updateCardsOrder: vi.fn().mockResolvedValue(undefined),
  };
});

describe('useCardManagementStore', () => {
  beforeEach(async () => {
    const { loadCards, flippedPan, isReorderMode, disableReorderMode } =
      useCardManagementStore.getState();

    await loadCards();

    if (flippedPan) {
      useCardManagementStore.getState().flipCard(flippedPan);
    }

    if (isReorderMode) {
      disableReorderMode();
    }
  });

  it('должна инициализировать store с картами и flippedPan = null', () => {
    const { cards, flippedPan } = useCardManagementStore.getState();

    expect(cards).toBeDefined();
    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBeGreaterThan(0);
    expect(flippedPan).toBeNull();
  });

  it('должна переворачивать карту при вызове flipCard', () => {
    const { cards, flipCard } = useCardManagementStore.getState();
    const firstCardPan = cards[0].pan;

    flipCard(firstCardPan);

    const { flippedPan } = useCardManagementStore.getState();
    expect(flippedPan).toBe(firstCardPan);
  });

  it('должна переворачивать карту обратно при повторном вызове flipCard', () => {
    const { cards, flipCard } = useCardManagementStore.getState();
    const firstCardPan = cards[0].pan;

    flipCard(firstCardPan);
    flipCard(firstCardPan);

    const { flippedPan } = useCardManagementStore.getState();
    expect(flippedPan).toBeNull();
  });

  it('должна переворачивать только одну карту за раз', () => {
    const { cards, flipCard } = useCardManagementStore.getState();
    const firstCardPan = cards[0].pan;
    const secondCardPan = cards[1].pan;

    flipCard(firstCardPan);

    const stateAfterFirst = useCardManagementStore.getState();
    expect(stateAfterFirst.flippedPan).toBe(firstCardPan);

    flipCard(secondCardPan);

    const stateAfterSecond = useCardManagementStore.getState();
    expect(stateAfterSecond.flippedPan).toBe(secondCardPan);
  });

  it('должна содержать все необходимые свойства карты', () => {
    const { cards } = useCardManagementStore.getState();
    const firstCard = cards[0];

    expect(firstCard).toHaveProperty('pan');
    expect(firstCard).toHaveProperty('expires');
    expect(firstCard).toHaveProperty('name');
    expect(firstCard).toHaveProperty('cvv');
    expect(firstCard).toHaveProperty('pin');
  });

  it('должна работать с несколькими переключениями карт', () => {
    const { cards, flipCard } = useCardManagementStore.getState();
    const firstCardPan = cards[0].pan;
    const secondCardPan = cards[1].pan;

    flipCard(firstCardPan);
    expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

    flipCard(firstCardPan);
    expect(useCardManagementStore.getState().flippedPan).toBeNull();

    flipCard(secondCardPan);
    expect(useCardManagementStore.getState().flippedPan).toBe(secondCardPan);

    flipCard(secondCardPan);
    expect(useCardManagementStore.getState().flippedPan).toBeNull();
  });

  it('должна загружать карты асинхронно', async () => {
    const { loadCards, cards: initialCards } =
      useCardManagementStore.getState();

    expect(initialCards.length).toBeGreaterThan(0);

    await loadCards();

    const { cards: loadedCards } = useCardManagementStore.getState();
    expect(loadedCards.length).toBeGreaterThan(0);
  });

  it('должна обрабатывать ошибки при загрузке карт', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Database error');

    vi.mocked(sharedLib.getAllCards).mockRejectedValueOnce(mockError);

    const { loadCards } = useCardManagementStore.getState();
    await loadCards();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardManagementStore.loadCards] Не удалось загрузить карты',
      mockError
    );
    expect(useCardManagementStore.getState().isLoading).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('должна обрабатывать ошибки при добавлении карты', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Add card error');

    vi.mocked(sharedLib.addCard).mockRejectedValueOnce(mockError);

    const { addCard } = useCardManagementStore.getState();
    const mockCard = {
      pan: '5559494202595236',
      expires: '0726',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    await expect(addCard(mockCard)).rejects.toThrow(mockError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardManagementStore.addCard] Не удалось добавить карту',
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it('должна обрабатывать ошибки при обновлении карты', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Update card error');

    vi.mocked(sharedLib.updateCard).mockRejectedValueOnce(mockError);

    const { updateCard } = useCardManagementStore.getState();
    const mockCard = {
      pan: '5559494202595236',
      expires: '0726',
      name: 'UPDATED USER',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    await expect(updateCard(mockCard)).rejects.toThrow(mockError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardManagementStore.updateCard] Не удалось обновить карту',
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it('должна обрабатывать ошибки при удалении карты', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Delete card error');

    vi.mocked(sharedLib.deleteCard).mockRejectedValueOnce(mockError);

    const { deleteCard } = useCardManagementStore.getState();

    await expect(deleteCard('5559494202595236')).rejects.toThrow(mockError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardManagementStore.deleteCard] Не удалось удалить карту',
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it('должна сбрасывать все перевернутые карты при вызове unflipCards', () => {
    const { cards, flipCard, unflipCards } = useCardManagementStore.getState();
    const firstCardPan = cards[0].pan;

    flipCard(firstCardPan);
    expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

    unflipCards();
    expect(useCardManagementStore.getState().flippedPan).toBeNull();
  });

  it('должна переключать режим переупорядочивания при вызове toggleReorderMode', () => {
    const { toggleReorderMode, isReorderMode } =
      useCardManagementStore.getState();

    expect(isReorderMode).toBe(false);

    toggleReorderMode();
    expect(useCardManagementStore.getState().isReorderMode).toBe(true);

    toggleReorderMode();
    expect(useCardManagementStore.getState().isReorderMode).toBe(false);
  });

  it('должна сбрасывать flippedPan при включении режима переупорядочивания', () => {
    const { cards, flipCard, toggleReorderMode } =
      useCardManagementStore.getState();
    const firstCardPan = cards[0].pan;

    flipCard(firstCardPan);
    expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

    toggleReorderMode();
    expect(useCardManagementStore.getState().flippedPan).toBeNull();
    expect(useCardManagementStore.getState().isReorderMode).toBe(true);
  });

  it('должна устанавливать карты при вызове setCards', () => {
    const mockCards = [
      {
        pan: '1111222233334444',
        expires: '1230',
        name: 'NEW USER',
        cvv: '789',
        pin: '9999',
        order: 0,
      },
    ];

    const { setCards } = useCardManagementStore.getState();
    setCards(mockCards);

    const { cards } = useCardManagementStore.getState();
    expect(cards).toEqual(mockCards);
  });

  it('должна переупорядочивать карты', async () => {
    vi.mocked(sharedLib.updateCardsOrder).mockResolvedValueOnce(undefined);

    const mockCards = [
      {
        pan: '1111222233334444',
        expires: '1230',
        name: 'CARD 1',
        cvv: '789',
        pin: '9999',
        order: 0,
      },
      {
        pan: '5555666677778888',
        expires: '1231',
        name: 'CARD 2',
        cvv: '456',
        pin: '8888',
        order: 1,
      },
    ];

    const { reorderCards } = useCardManagementStore.getState();
    await reorderCards(mockCards);

    expect(sharedLib.updateCardsOrder).toHaveBeenCalledWith(mockCards);
  });

  it('должна обрабатывать ошибки при переупорядочивании карт', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Reorder error');

    vi.mocked(sharedLib.updateCardsOrder).mockRejectedValueOnce(mockError);

    const mockCards = [
      {
        pan: '1111222233334444',
        expires: '1230',
        name: 'CARD 1',
        cvv: '789',
        pin: '9999',
        order: 0,
      },
    ];

    const { reorderCards } = useCardManagementStore.getState();
    await expect(reorderCards(mockCards)).rejects.toThrow(mockError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardManagementStore.reorderCards] Не удалось изменить порядок карт',
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it('должна обновлять карту без order, получая order из существующей карты', async () => {
    const mockExistingCard = {
      pan: '5559494202595236',
      expires: '0726',
      name: 'OLD NAME',
      cvv: '123',
      pin: '1234',
      order: 5,
    };

    vi.mocked(sharedLib.getCardByPan).mockResolvedValueOnce(mockExistingCard);
    vi.mocked(sharedLib.updateCard).mockResolvedValueOnce(undefined);

    const mockCard = {
      pan: '5559494202595236',
      expires: '0726',
      name: 'NEW NAME',
      cvv: '123',
      pin: '1234',
    } as IBankCard;

    const { updateCard } = useCardManagementStore.getState();
    await updateCard(mockCard);

    expect(sharedLib.getCardByPan).toHaveBeenCalledWith(mockCard.pan);
    expect(sharedLib.updateCard).toHaveBeenCalledWith({
      ...mockCard,
      order: 5,
    });
  });

  describe('enableReorderMode', () => {
    it('должна включать режим переупорядочивания', () => {
      const { enableReorderMode, isReorderMode } =
        useCardManagementStore.getState();

      expect(isReorderMode).toBe(false);

      enableReorderMode();

      expect(useCardManagementStore.getState().isReorderMode).toBe(true);
    });

    it('должна сбрасывать flippedPan при включении режима', () => {
      const { cards, flipCard, enableReorderMode } =
        useCardManagementStore.getState();
      const firstCardPan = cards[0].pan;

      flipCard(firstCardPan);
      expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

      enableReorderMode();

      expect(useCardManagementStore.getState().flippedPan).toBeNull();
      expect(useCardManagementStore.getState().isReorderMode).toBe(true);
    });

    it('не должна изменять состояние если режим уже включен', () => {
      const { enableReorderMode } = useCardManagementStore.getState();

      enableReorderMode();
      const stateAfterFirst = useCardManagementStore.getState();

      enableReorderMode();
      const stateAfterSecond = useCardManagementStore.getState();

      expect(stateAfterFirst).toBe(stateAfterSecond);
    });
  });

  describe('disableReorderMode', () => {
    it('должна отключать режим переупорядочивания', () => {
      const { enableReorderMode, disableReorderMode } =
        useCardManagementStore.getState();

      enableReorderMode();
      expect(useCardManagementStore.getState().isReorderMode).toBe(true);

      disableReorderMode();

      expect(useCardManagementStore.getState().isReorderMode).toBe(false);
    });

    it('должна сбрасывать flippedPan при отключении режима', () => {
      const { cards, flipCard, enableReorderMode, disableReorderMode } =
        useCardManagementStore.getState();
      const firstCardPan = cards[0].pan;

      enableReorderMode();
      flipCard(firstCardPan);
      expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

      disableReorderMode();

      expect(useCardManagementStore.getState().flippedPan).toBeNull();
      expect(useCardManagementStore.getState().isReorderMode).toBe(false);
    });

    it('не должна изменять состояние если режим уже отключен', () => {
      const { disableReorderMode } = useCardManagementStore.getState();

      const stateAfterFirst = useCardManagementStore.getState();
      disableReorderMode();
      const stateAfterSecond = useCardManagementStore.getState();

      expect(stateAfterFirst).toBe(stateAfterSecond);
    });
  });

  describe('toggleReorderMode с enableReorderMode и disableReorderMode', () => {
    it('должна использовать enableReorderMode при включении', () => {
      const { toggleReorderMode, isReorderMode } =
        useCardManagementStore.getState();

      expect(isReorderMode).toBe(false);

      toggleReorderMode();

      expect(useCardManagementStore.getState().isReorderMode).toBe(true);
    });

    it('должна использовать disableReorderMode при отключении', () => {
      const { toggleReorderMode, enableReorderMode } =
        useCardManagementStore.getState();

      enableReorderMode();
      expect(useCardManagementStore.getState().isReorderMode).toBe(true);

      toggleReorderMode();

      expect(useCardManagementStore.getState().isReorderMode).toBe(false);
    });

    it('должна сбрасывать flippedPan при переключении в оба режима', () => {
      const { cards, flipCard, toggleReorderMode } =
        useCardManagementStore.getState();
      const firstCardPan = cards[0].pan;

      flipCard(firstCardPan);
      expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

      toggleReorderMode();
      expect(useCardManagementStore.getState().flippedPan).toBeNull();
      expect(useCardManagementStore.getState().isReorderMode).toBe(true);

      flipCard(firstCardPan);
      expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

      toggleReorderMode();
      expect(useCardManagementStore.getState().flippedPan).toBeNull();
      expect(useCardManagementStore.getState().isReorderMode).toBe(false);
    });
  });
});
