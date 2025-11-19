import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  CARDS_STORE_NAME,
  CARDS_KEY_PATH,
} from './constants';

let mockOpenRequest: {
  result: IDBDatabase | null;
  error: Error | null;
  onsuccess: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onupgradeneeded: ((event: IDBVersionChangeEvent) => void) | null;
};

let mockDatabase: IDBDatabase;
let mockIndexedDB: {
  open: ReturnType<typeof vi.fn>;
};

let originalIndexedDB: IDBFactory | undefined;

describe('IndexedDB database', () => {
  beforeEach(() => {
    originalIndexedDB = globalThis.indexedDB;

    mockDatabase = {
      objectStoreNames: {
        contains: vi.fn().mockReturnValue(false),
      },
      createObjectStore: vi.fn(),
    } as unknown as IDBDatabase;

    mockOpenRequest = {
      result: null,
      error: null,
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    };

    mockIndexedDB = {
      open: vi.fn().mockReturnValue(mockOpenRequest),
    };

    globalThis.indexedDB = mockIndexedDB as unknown as IDBFactory;
    vi.resetModules();
  });

  afterEach(() => {
    if (originalIndexedDB) {
      globalThis.indexedDB = originalIndexedDB;
    }
    vi.clearAllMocks();
  });

  it('должна инициализировать базу данных успешно', async () => {
    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    const result = await promise;

    expect(mockIndexedDB.open).toHaveBeenCalledWith(
      DATABASE_NAME,
      DATABASE_VERSION
    );
    expect(result).toBe(mockDatabase);
  });

  it('должна обрабатывать ошибку при открытии базы данных', async () => {
    const { initDatabase } = await import('./database');
    const promise = initDatabase();
    const mockError = new Error('Failed to open database');

    mockOpenRequest.error = mockError;

    if (mockOpenRequest.onerror) {
      mockOpenRequest.onerror({} as Event);
    }

    await expect(promise).rejects.toThrow('Failed to open database');
  });

  it('должна создавать object store при обновлении версии', async () => {
    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockObjectStore = {
      createIndex: vi.fn(),
    } as unknown as IDBObjectStore;

    const mockDatabase = {
      objectStoreNames: {
        contains: vi.fn().mockReturnValue(false),
      },
      createObjectStore: vi.fn().mockReturnValue(mockObjectStore),
    } as unknown as IDBDatabase;

    const mockTransaction = {
      objectStore: vi.fn().mockReturnValue(mockObjectStore),
    } as unknown as IDBTransaction;

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: mockTransaction,
      },
    } as unknown as IDBVersionChangeEvent;

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onupgradeneeded) {
      mockOpenRequest.onupgradeneeded(mockEvent);
    }

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await promise;

    expect(mockDatabase.objectStoreNames.contains).toHaveBeenCalledWith(
      CARDS_STORE_NAME
    );
    expect(mockDatabase.createObjectStore).toHaveBeenCalledWith(
      CARDS_STORE_NAME,
      {
        keyPath: CARDS_KEY_PATH,
      }
    );
  });

  it('не должна создавать object store если он уже существует', async () => {
    mockDatabase.objectStoreNames.contains = vi.fn().mockReturnValue(true);

    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockObjectStore = {
      createIndex: vi.fn(),
      indexNames: {
        contains: vi.fn().mockReturnValue(false),
      },
      getAll: vi.fn().mockReturnValue({
        onsuccess: null,
        result: [],
      }),
      put: vi.fn(),
    } as unknown as IDBObjectStore;

    const mockTransaction = {
      objectStore: vi.fn().mockReturnValue(mockObjectStore),
    } as unknown as IDBTransaction;

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: mockTransaction,
      },
    } as unknown as IDBVersionChangeEvent;

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onupgradeneeded) {
      mockOpenRequest.onupgradeneeded(mockEvent);
    }

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await promise;

    expect(mockDatabase.objectStoreNames.contains).toHaveBeenCalledWith(
      CARDS_STORE_NAME
    );
    expect(mockDatabase.createObjectStore).not.toHaveBeenCalled();
  });

  it('getDatabase должна возвращать существующий экземпляр базы данных', async () => {
    const { initDatabase, getDatabase } = await import('./database');
    const firstPromise = initDatabase();
    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await firstPromise;

    const secondResult = await getDatabase();

    expect(secondResult).toBe(mockDatabase);
    expect(mockIndexedDB.open).toHaveBeenCalledTimes(1);
  });

  it('initDatabase должна возвращать кэшированный экземпляр при повторном вызове', async () => {
    const { initDatabase } = await import('./database');
    const firstPromise = initDatabase();
    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await firstPromise;

    const secondPromise = initDatabase();
    const secondResult = await secondPromise;

    expect(secondResult).toBe(mockDatabase);
    expect(mockIndexedDB.open).toHaveBeenCalledTimes(1);
  });

  it('getDatabase должна инициализировать базу если она не существует', async () => {
    const { getDatabase } = await import('./database');
    const promise = getDatabase();
    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    const result = await promise;

    expect(mockIndexedDB.open).toHaveBeenCalledWith(
      DATABASE_NAME,
      DATABASE_VERSION
    );
    expect(result).toBe(mockDatabase);
  });

  it('должна обрабатывать onupgradeneeded без transaction', async () => {
    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: null,
      },
    } as unknown as IDBVersionChangeEvent;

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onupgradeneeded) {
      mockOpenRequest.onupgradeneeded(mockEvent);
    }

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await promise;

    expect(mockDatabase.createObjectStore).not.toHaveBeenCalled();
  });

  it('должна мигрировать существующие карты при добавлении индекса order', async () => {
    mockDatabase.objectStoreNames.contains = vi.fn().mockReturnValue(true);

    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockCards = [
      {
        pan: '1111',
        expires: '12/25',
        name: 'Card 1',
        cvv: '123',
        pin: '1234',
      },
      {
        pan: '2222',
        expires: '12/26',
        name: 'Card 2',
        cvv: '456',
        pin: '5678',
      },
    ];

    const mockObjectStore = {
      createIndex: vi.fn(),
      indexNames: {
        contains: vi.fn().mockReturnValue(false),
      },
      getAll: vi.fn().mockReturnValue({
        onsuccess: null,
        result: mockCards,
      }),
      put: vi.fn(),
    } as unknown as IDBObjectStore;

    const mockTransaction = {
      objectStore: vi.fn().mockReturnValue(mockObjectStore),
    } as unknown as IDBTransaction;

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: mockTransaction,
      },
    } as unknown as IDBVersionChangeEvent;

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onupgradeneeded) {
      mockOpenRequest.onupgradeneeded(mockEvent);
    }

    const getAllRequest = mockObjectStore.getAll();

    if (getAllRequest.onsuccess) {
      getAllRequest.onsuccess({} as Event);
    }

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await promise;

    expect(mockObjectStore.put).toHaveBeenCalledTimes(2);
    expect(mockObjectStore.put).toHaveBeenCalledWith({
      ...mockCards[0],
      order: 0,
    });
    expect(mockObjectStore.put).toHaveBeenCalledWith({
      ...mockCards[1],
      order: 1,
    });
  });

  it('должна обрабатывать onupgradeneeded с невалидным target', async () => {
    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockEvent = {
      target: null,
    } as unknown as IDBVersionChangeEvent;

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onupgradeneeded) {
      mockOpenRequest.onupgradeneeded(mockEvent);
    }

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await promise;

    expect(mockDatabase.createObjectStore).not.toHaveBeenCalled();
  });

  it('не должна миграировать если result не является массивом', async () => {
    mockDatabase.objectStoreNames.contains = vi.fn().mockReturnValue(true);

    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockObjectStore = {
      createIndex: vi.fn(),
      indexNames: {
        contains: vi.fn().mockReturnValue(false),
      },
      getAll: vi.fn().mockReturnValue({
        onsuccess: null,
        result: null,
      }),
      put: vi.fn(),
    } as unknown as IDBObjectStore;

    const mockTransaction = {
      objectStore: vi.fn().mockReturnValue(mockObjectStore),
    } as unknown as IDBTransaction;

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: mockTransaction,
      },
    } as unknown as IDBVersionChangeEvent;

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onupgradeneeded) {
      mockOpenRequest.onupgradeneeded(mockEvent);
    }

    const getAllRequest = mockObjectStore.getAll();

    if (getAllRequest.onsuccess) {
      getAllRequest.onsuccess({} as Event);
    }

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await promise;

    expect(mockObjectStore.put).not.toHaveBeenCalled();
  });

  it('должна создавать индекс order если он не существует и обновлять существующие карты', async () => {
    mockDatabase.objectStoreNames.contains = vi.fn().mockReturnValue(true);

    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockCards = [
      {
        pan: '1111',
        expires: '12/25',
        name: 'Card 1',
        cvv: '123',
        pin: '1234',
      },
    ];

    const mockObjectStore = {
      createIndex: vi.fn(),
      indexNames: {
        contains: vi.fn().mockReturnValue(false),
      },
      getAll: vi.fn().mockReturnValue({
        onsuccess: null,
        result: mockCards,
      }),
      put: vi.fn(),
    } as unknown as IDBObjectStore;

    const mockTransaction = {
      objectStore: vi.fn().mockReturnValue(mockObjectStore),
    } as unknown as IDBTransaction;

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: mockTransaction,
      },
    } as unknown as IDBVersionChangeEvent;

    mockOpenRequest.result = mockDatabase;

    if (mockOpenRequest.onupgradeneeded) {
      mockOpenRequest.onupgradeneeded(mockEvent);
    }

    const getAllRequest = mockObjectStore.getAll();

    if (getAllRequest.onsuccess) {
      getAllRequest.onsuccess({} as Event);
    }

    if (mockOpenRequest.onsuccess) {
      mockOpenRequest.onsuccess({} as Event);
    }

    await promise;

    expect(mockObjectStore.createIndex).toHaveBeenCalled();
    expect(mockObjectStore.put).toHaveBeenCalled();
  });
});
