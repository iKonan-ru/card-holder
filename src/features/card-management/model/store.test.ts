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
    clearAllCards: vi.fn().mockResolvedValue(undefined),
    updateCardsOrder: vi.fn().mockResolvedValue(undefined),
  };
});

describe('useCardManagementStore', () => {
  beforeEach(async () => {
    const { loadCards, flippedPan, isReorderMode, setReorderMode } =
      useCardManagementStore.getState();

    await loadCards();

    if (flippedPan) {
      useCardManagementStore.getState().flipCard(flippedPan);
    }

    if (isReorderMode) {
      setReorderMode(false);
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

  it('должна добавлять карту и обновлять state через onSuccess', async () => {
    const mockNewCard = {
      pan: '5536914125525541',
      expires: '1230',
      name: 'NEW CARD',
      cvv: '999',
      pin: '9999',
    } as IBankCard;

    const expectedCardsAfterAdd = [
      ...useCardManagementStore.getState().cards,
      { ...mockNewCard, order: 2 },
    ];

    vi.mocked(sharedLib.getAllCards)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(expectedCardsAfterAdd);
    vi.mocked(sharedLib.addCard).mockResolvedValueOnce(undefined);

    const { addCard } = useCardManagementStore.getState();
    await addCard(mockNewCard);

    expect(sharedLib.addCard).toHaveBeenCalled();
    expect(sharedLib.getAllCards).toHaveBeenCalled();
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

  it('должна обновлять карту с order и обновлять state через onSuccess', async () => {
    const mockUpdatedCard = {
      pan: '5559494202595236',
      expires: '0726',
      name: 'UPDATED USER',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const expectedCardsAfterUpdate = [mockUpdatedCard];

    vi.mocked(sharedLib.updateCard).mockResolvedValueOnce(undefined);
    vi.mocked(sharedLib.getAllCards).mockResolvedValueOnce(
      expectedCardsAfterUpdate
    );

    const { updateCard } = useCardManagementStore.getState();
    await updateCard(mockUpdatedCard);

    expect(sharedLib.updateCard).toHaveBeenCalledWith(mockUpdatedCard);
    expect(sharedLib.getAllCards).toHaveBeenCalled();
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

  it('должна удалять карту и обновлять state через onSuccess', async () => {
    const panToDelete = '5559494202595236';
    const expectedCardsAfterDelete: IBankCard[] = [];

    vi.mocked(sharedLib.deleteCard).mockResolvedValueOnce(undefined);
    vi.mocked(sharedLib.getAllCards).mockResolvedValueOnce(
      expectedCardsAfterDelete
    );

    const { deleteCard } = useCardManagementStore.getState();
    await deleteCard(panToDelete);

    expect(sharedLib.deleteCard).toHaveBeenCalledWith(panToDelete);
    expect(sharedLib.getAllCards).toHaveBeenCalled();
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

  describe('setReorderMode', () => {
    it('должна включать режим переупорядочивания', () => {
      const { setReorderMode } = useCardManagementStore.getState();

      setReorderMode(true);

      expect(useCardManagementStore.getState().isReorderMode).toBe(true);
    });

    it('должна отключать режим переупорядочивания', () => {
      const { setReorderMode } = useCardManagementStore.getState();

      setReorderMode(true);
      expect(useCardManagementStore.getState().isReorderMode).toBe(true);

      setReorderMode(false);

      expect(useCardManagementStore.getState().isReorderMode).toBe(false);
    });

    it('должна сбрасывать flippedPan при изменении режима', () => {
      const { cards, flipCard, setReorderMode } =
        useCardManagementStore.getState();
      const firstCardPan = cards[0].pan;

      flipCard(firstCardPan);
      expect(useCardManagementStore.getState().flippedPan).toBe(firstCardPan);

      setReorderMode(true);

      expect(useCardManagementStore.getState().flippedPan).toBeNull();
      expect(useCardManagementStore.getState().isReorderMode).toBe(true);
    });

    it('не должна изменять состояние если режим уже установлен', () => {
      const { setReorderMode } = useCardManagementStore.getState();

      setReorderMode(false);
      const stateAfterFirst = useCardManagementStore.getState();
      setReorderMode(false);
      const stateAfterSecond = useCardManagementStore.getState();

      expect(stateAfterFirst).toBe(stateAfterSecond);
    });
  });

  describe('toggleReorderMode', () => {
    it('должна переключать режим с false на true', () => {
      const { toggleReorderMode, isReorderMode } =
        useCardManagementStore.getState();

      expect(isReorderMode).toBe(false);

      toggleReorderMode();

      expect(useCardManagementStore.getState().isReorderMode).toBe(true);
    });

    it('должна переключать режим с true на false', () => {
      const { toggleReorderMode, setReorderMode } =
        useCardManagementStore.getState();

      setReorderMode(true);
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

  describe('clearAllCards', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('должна очищать все карты и обновлять state', async () => {
      vi.mocked(sharedLib.clearAllCards).mockResolvedValueOnce(undefined);
      vi.mocked(sharedLib.getAllCards).mockResolvedValueOnce([]);

      const { clearAllCards } = useCardManagementStore.getState();

      expect(useCardManagementStore.getState().cards.length).toBeGreaterThan(0);

      await clearAllCards();

      expect(sharedLib.clearAllCards).toHaveBeenCalledOnce();
      expect(sharedLib.getAllCards).toHaveBeenCalled();
      expect(useCardManagementStore.getState().cards).toEqual([]);
    });

    it('должна вызывать executeCardOperation с правильными параметрами', async () => {
      vi.mocked(sharedLib.clearAllCards).mockResolvedValueOnce(undefined);
      vi.mocked(sharedLib.getAllCards).mockResolvedValueOnce([]);

      const { clearAllCards } = useCardManagementStore.getState();

      await clearAllCards();

      expect(sharedLib.clearAllCards).toHaveBeenCalledOnce();
    });

    it('должна обрабатывать ошибки при очистке карт', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Clear cards error');

      vi.mocked(sharedLib.clearAllCards).mockRejectedValueOnce(mockError);

      const { clearAllCards } = useCardManagementStore.getState();

      await expect(clearAllCards()).rejects.toThrow(mockError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Card Holder] [CardManagementStore.clearAllCards] Не удалось очистить карты',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('должна обновлять cards в state после успешной очистки', async () => {
      const emptyCards: never[] = [];

      vi.mocked(sharedLib.clearAllCards).mockResolvedValueOnce(undefined);
      vi.mocked(sharedLib.getAllCards).mockResolvedValueOnce(emptyCards);

      const { clearAllCards } = useCardManagementStore.getState();

      await clearAllCards();

      expect(useCardManagementStore.getState().cards).toEqual(emptyCards);
    });

    it('не должна изменять state при ошибке очистки', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const initialCards = useCardManagementStore.getState().cards;
      const mockError = new Error('Clear error');

      vi.mocked(sharedLib.clearAllCards).mockRejectedValueOnce(mockError);

      const { clearAllCards } = useCardManagementStore.getState();

      await expect(clearAllCards()).rejects.toThrow();

      expect(useCardManagementStore.getState().cards).toEqual(initialCards);

      consoleErrorSpy.mockRestore();
    });
  });
});
