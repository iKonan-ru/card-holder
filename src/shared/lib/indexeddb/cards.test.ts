import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAllCards,
  addCard,
  updateCard,
  deleteCard,
  getCardByPan,
  checkCardExists,
  clearAllCards,
  updateCardsOrder,
} from './cards';
import type { IBankCard } from '@entities/bank-card';

const MOCK_CARDS: IBankCard[] = [
  {
    pan: '1111222233334444',
    expires: '1230',
    name: 'CARD 2',
    cvv: '456',
    pin: '8888',
    order: 1,
  },
  {
    pan: '5559494202595236',
    expires: '0726',
    name: 'CARD 1',
    cvv: '123',
    pin: '1234',
    order: 0,
  },
  {
    pan: '9999888877776666',
    expires: '0725',
    name: 'CARD 3',
    cvv: '789',
    pin: '4321',
    order: 2,
  },
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

describe('IndexedDB cards', () => {
  const MOCK_CARD: IBankCard = {
    pan: '5559494202595236',
    expires: '0726',
    name: 'TEST USER',
    cvv: '123',
    pin: '1234',
    order: 0,
  };

  it('getAllCards должна возвращать отсортированный список карт', async () => {
    const request = (mockStore.getAll as () => IMockRequest)() as IMockRequest;
    request.result = [...MOCK_CARDS];

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await getAllCards();

    expect(result[0].order).toBe(0);
    expect(result[1].order).toBe(1);
    expect(result[2].order).toBe(2);
  });

  it('getCardByPan должна возвращать карту по номеру', async () => {
    const request = (mockStore.get as (pan: string) => IMockRequest)(
      MOCK_CARD.pan
    ) as IMockRequest;
    request.result = MOCK_CARD;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    const result = await getCardByPan(MOCK_CARD.pan);

    expect(result).toEqual(MOCK_CARD);
  });

  it('checkCardExists должна возвращать true если карта существует', async () => {
    const request = (mockStore.get as (pan: string) => IMockRequest)(
      MOCK_CARD.pan
    ) as IMockRequest;
    request.result = MOCK_CARD;

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
      MOCK_CARD.pan
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
    const request = (mockStore.add as (card: IBankCard) => IMockRequest)(
      MOCK_CARD
    ) as IMockRequest;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    await expect(addCard(MOCK_CARD)).resolves.toBeUndefined();
    expect(mockStore.add).toHaveBeenCalledWith(MOCK_CARD);
  });

  it('updateCard должна обновлять карту в хранилище', async () => {
    const request = (mockStore.put as (card: IBankCard) => IMockRequest)(
      MOCK_CARD
    ) as IMockRequest;

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess(new Event('success'));
      }
    }, 0);

    await expect(updateCard(MOCK_CARD)).resolves.toBeUndefined();
    expect(mockStore.put).toHaveBeenCalledWith(MOCK_CARD);
  });

  it('deleteCard должна удалять карту из хранилища', async () => {
    const request = (mockStore.delete as (pan: string) => IMockRequest)(
      MOCK_CARD.pan
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

    await expect(updateCardsOrder(cardsToReorder)).resolves.toBeUndefined();

    expect(mockStore.put).toHaveBeenCalledTimes(3);
    expect(mockStore.put).toHaveBeenCalledWith({
      ...cardsToReorder[0],
      order: 0,
    });
    expect(mockStore.put).toHaveBeenCalledWith({
      ...cardsToReorder[1],
      order: 1,
    });
    expect(mockStore.put).toHaveBeenCalledWith({
      ...cardsToReorder[2],
      order: 2,
    });
  });

  it('updateCardsOrder должна обрабатывать ошибки транзакции', async () => {
    setTimeout(() => {
      if (mockTransaction.onerror) {
        mockTransaction.onerror(new Event('error'));
      }
    }, 0);

    await expect(updateCardsOrder(MOCK_CARDS)).rejects.toThrow(
      'Не удалось обновить порядок карт'
    );
  });
});
