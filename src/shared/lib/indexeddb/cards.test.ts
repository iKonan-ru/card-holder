import { createMockCard, MOCK_CARD_THIRD } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import type { IStoredEncryptedCard } from '../crypto';
import {
  addCard,
  checkCardExists,
  clearAllCards,
  deleteCard,
  getAllCards,
  getAllRawCards,
  getCardByPan,
  updateCard,
  updateCardsOrder,
} from './cards';

vi.mock('../crypto', async () => {
  const actual = await vi.importActual<typeof import('../crypto')>('../crypto');

  return {
    ...actual,
    encryptCardFields: vi.fn(
      async (card: IBankCard): Promise<IStoredEncryptedCard> => ({
        pan: card.pan,
        order: card.order,
        encryptedPayload: JSON.stringify(card),
      }),
    ),
    decryptCardFields: vi.fn(
      async (record: IStoredEncryptedCard): Promise<IBankCard> =>
        JSON.parse(record.encryptedPayload) as IBankCard,
    ),
  };
});

const MOCK_CRYPTO_KEY = {} as CryptoKey;

const MOCK_CARDS: IBankCard[] = [
  createMockCard({
    pan: '1111222233334444',
    expires: '1230',
    name: 'CARD 2',
    cvv: '456',
    pin: '8888',
    order: 1,
  }),
  createMockCard({
    name: 'CARD 1',
    order: 0,
  }),
  createMockCard({
    pan: MOCK_CARD_THIRD.pan,
    expires: MOCK_CARD_THIRD.expires,
    name: 'CARD 3',
    cvv: MOCK_CARD_THIRD.cvv,
    pin: MOCK_CARD_THIRD.pin,
    order: 2,
  }),
];

interface IMockRequest {
  onsuccess: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  result?: unknown;
}

let mockStore: {
  getAll: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  add: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
};

let mockTransaction: {
  objectStore: ReturnType<typeof vi.fn>;
  oncomplete: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
};

beforeEach(() => {
  mockStore = {
    getAll: vi.fn().mockReturnValue({
      onsuccess: null,
      onerror: null,
      result: [],
    } as IMockRequest),
    get: vi.fn().mockReturnValue({
      onsuccess: null,
      onerror: null,
      result: undefined,
    } as IMockRequest),
    add: vi.fn().mockReturnValue({
      onsuccess: null,
      onerror: null,
    } as IMockRequest),
    put: vi.fn().mockReturnValue({
      onsuccess: null,
      onerror: null,
    } as IMockRequest),
    delete: vi.fn().mockReturnValue({
      onsuccess: null,
      onerror: null,
    } as IMockRequest),
    clear: vi.fn().mockReturnValue({
      onsuccess: null,
      onerror: null,
    } as IMockRequest),
  };

  mockTransaction = {
    objectStore: vi.fn().mockReturnValue(mockStore),
    oncomplete: null,
    onerror: null,
  };
});

vi.mock('./database', () => ({
  getDatabase: vi.fn(() => {
    return Promise.resolve({
      transaction: vi.fn(() => mockTransaction),
    });
  }),
}));

const toStored = (card: IBankCard): IStoredEncryptedCard => ({
  pan: card.pan,
  order: card.order,
  encryptedPayload: JSON.stringify(card),
});

describe('IndexedDB cards', () => {
  const MOCK_CARD = createMockCard();
  const MOCK_STORED_CARD = toStored(MOCK_CARD);

  it('getAllRawCards должна возвращать необработанный список карт из хранилища', async () => {
    const request = (mockStore.getAll as () => IMockRequest)() as IMockRequest;
    const rawCards = MOCK_CARDS as unknown as IBankCard[];
    request.result = rawCards;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await getAllRawCards();

    expect(result).toEqual(rawCards);
  });

  it('getAllRawCards должна возвращать пустой массив если карт нет', async () => {
    const request = (mockStore.getAll as () => IMockRequest)() as IMockRequest;
    request.result = [];

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await getAllRawCards();

    expect(result).toEqual([]);
  });

  it('getAllCards должна возвращать отсортированный список карт', async () => {
    const request = (mockStore.getAll as () => IMockRequest)() as IMockRequest;
    request.result = MOCK_CARDS.map(toStored);

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await getAllCards(MOCK_CRYPTO_KEY);

    expect(result[0].order).toBe(0);
    expect(result[1].order).toBe(1);
    expect(result[2].order).toBe(2);
  });

  it('getCardByPan должна возвращать карту по номеру', async () => {
    const request = (mockStore.get as (pan: string) => IMockRequest)(
      MOCK_CARD.pan,
    ) as IMockRequest;
    request.result = MOCK_STORED_CARD;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await getCardByPan(MOCK_CARD.pan, MOCK_CRYPTO_KEY);

    expect(result).toEqual(MOCK_CARD);
  });

  it('checkCardExists должна возвращать true если карта существует', async () => {
    const request = (mockStore.get as (pan: string) => IMockRequest)(
      MOCK_CARD.pan,
    ) as IMockRequest;
    request.result = MOCK_STORED_CARD;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await checkCardExists(MOCK_CARD.pan);

    expect(result).toBe(true);
  });

  it('checkCardExists должна возвращать false если карта не существует', async () => {
    const request = (mockStore.get as (pan: string) => IMockRequest)(
      MOCK_CARD.pan,
    ) as IMockRequest;
    request.result = undefined;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await checkCardExists(MOCK_CARD.pan);

    expect(result).toBe(false);
  });

  it('addCard должна добавлять карту в хранилище', async () => {
    const request = (
      mockStore.add as (card: IStoredEncryptedCard) => IMockRequest
    )(MOCK_STORED_CARD) as IMockRequest;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    await expect(addCard(MOCK_CARD, MOCK_CRYPTO_KEY)).resolves.toBeUndefined();
    expect(mockStore.add).toHaveBeenCalledWith(
      expect.objectContaining({ pan: MOCK_CARD.pan }),
    );
  });

  it('updateCard должна обновлять карту в хранилище', async () => {
    const request = (
      mockStore.put as (card: IStoredEncryptedCard) => IMockRequest
    )(MOCK_STORED_CARD) as IMockRequest;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    await expect(
      updateCard(MOCK_CARD, MOCK_CRYPTO_KEY),
    ).resolves.toBeUndefined();
    expect(mockStore.put).toHaveBeenCalledWith(
      expect.objectContaining({ pan: MOCK_CARD.pan }),
    );
  });

  it('deleteCard должна удалять карту из хранилища', async () => {
    const request = (mockStore.delete as (pan: string) => IMockRequest)(
      MOCK_CARD.pan,
    ) as IMockRequest;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    await expect(deleteCard(MOCK_CARD.pan)).resolves.toBeUndefined();
    expect(mockStore.delete).toHaveBeenCalledWith(MOCK_CARD.pan);
  });

  it('clearAllCards должна очищать все карты из хранилища', async () => {
    const request = (mockStore.clear as () => IMockRequest)() as IMockRequest;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    await expect(clearAllCards()).resolves.toBeUndefined();
    expect(mockStore.clear).toHaveBeenCalled();
  });

  it('updateCardsOrder должна обновлять порядок карт', async () => {
    const cardsToReorder = [
      { ...MOCK_CARDS[2], order: 0 },
      { ...MOCK_CARDS[0], order: 1 },
      { ...MOCK_CARDS[1], order: 2 },
    ];

    setTimeout(() => {
      if (mockTransaction.oncomplete) {
        mockTransaction.oncomplete(new Event('complete'));
      }
    }, 0);

    await expect(
      updateCardsOrder(cardsToReorder, MOCK_CRYPTO_KEY),
    ).resolves.toBeUndefined();

    expect(mockStore.put).toHaveBeenCalledTimes(3);
    expect(mockStore.put).toHaveBeenCalledWith(
      expect.objectContaining({ pan: cardsToReorder[0].pan, order: 0 }),
    );
    expect(mockStore.put).toHaveBeenCalledWith(
      expect.objectContaining({ pan: cardsToReorder[1].pan, order: 1 }),
    );
    expect(mockStore.put).toHaveBeenCalledWith(
      expect.objectContaining({ pan: cardsToReorder[2].pan, order: 2 }),
    );
  });

  it('updateCardsOrder должна обрабатывать ошибки транзакции', async () => {
    setTimeout(() => {
      if (mockTransaction.onerror) {
        mockTransaction.onerror(new Event('error'));
      }
    }, 0);

    await expect(updateCardsOrder(MOCK_CARDS, MOCK_CRYPTO_KEY)).rejects.toThrow(
      'Не удалось обновить порядок карт',
    );
  });
});
