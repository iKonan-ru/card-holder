import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CARDS_KEY_PATH,
  CARDS_STORE_NAME,
  DATABASE_NAME,
  DATABASE_VERSION,
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
      deleteObjectStore: vi.fn(),
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
      DATABASE_VERSION,
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

  it('должна создавать object store при обновлении версии (хранилище не существует)', async () => {
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
      deleteObjectStore: vi.fn(),
    } as unknown as IDBDatabase;

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: {},
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
      CARDS_STORE_NAME,
    );
    expect(mockDatabase.deleteObjectStore).not.toHaveBeenCalled();
    expect(mockDatabase.createObjectStore).toHaveBeenCalledWith(
      CARDS_STORE_NAME,
      {
        keyPath: CARDS_KEY_PATH,
      },
    );
  });

  it('должна пересоздавать object store если он уже существует', async () => {
    const { initDatabase } = await import('./database');
    const promise = initDatabase();

    const mockObjectStore = {
      createIndex: vi.fn(),
    } as unknown as IDBObjectStore;

    const mockDatabase = {
      objectStoreNames: {
        contains: vi.fn().mockReturnValue(true),
      },
      createObjectStore: vi.fn().mockReturnValue(mockObjectStore),
      deleteObjectStore: vi.fn(),
    } as unknown as IDBDatabase;

    const mockEvent = {
      target: {
        ...mockOpenRequest,
        result: mockDatabase,
        transaction: {},
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

    expect(mockDatabase.deleteObjectStore).toHaveBeenCalledWith(
      CARDS_STORE_NAME,
    );
    expect(mockDatabase.createObjectStore).toHaveBeenCalledWith(
      CARDS_STORE_NAME,
      {
        keyPath: CARDS_KEY_PATH,
      },
    );
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
      DATABASE_VERSION,
    );
    expect(result).toBe(mockDatabase);
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
});
