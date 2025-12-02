import { beforeEach, describe, expect, it, vi } from 'vitest';
import { executeIndexedDBOperation } from '@shared/lib';
import * as database from './database';

vi.mock('./database');

describe('executeIndexedDBOperation', () => {
  const STORE_NAME = 'testStore';
  const TEST_VALUE = 'test result';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен успешно выполнить операцию и вернуть результат', async () => {
    let onsuccessHandler: ((event: Event) => void) | null = null;

    const mockRequest = {
      result: TEST_VALUE,
      set onsuccess(handler: ((event: Event) => void) | null) {
        onsuccessHandler = handler;
        if (handler) {
          setTimeout(() => handler(new Event('success')), 0);
        }
      },
      get onsuccess() {
        return onsuccessHandler;
      },
      onerror: null,
    } as unknown as IDBRequest;

    const mockStore = {} as IDBObjectStore;
    const mockTransaction = {
      objectStore: vi.fn(() => mockStore),
    } as unknown as IDBTransaction;

    const mockDatabase = {
      transaction: vi.fn(() => mockTransaction),
    } as unknown as IDBDatabase;

    vi.mocked(database.getDatabase).mockResolvedValue(mockDatabase);

    const mockOperation = vi.fn(() => mockRequest);

    const result = await executeIndexedDBOperation({
      storeName: STORE_NAME,
      mode: 'readonly',
      operation: mockOperation,
      errorMessage: 'Test error',
    });

    expect(result).toBe(TEST_VALUE);
    expect(database.getDatabase).toHaveBeenCalled();
    expect(mockDatabase.transaction).toHaveBeenCalledWith(
      [STORE_NAME],
      'readonly'
    );
    expect(mockOperation).toHaveBeenCalledWith(mockStore);
  });

  it('должен выбросить ошибку при неудачной операции', async () => {
    const ERROR_MESSAGE = 'Operation failed';
    let onerrorHandler: ((event: Event) => void) | null = null;

    const mockRequest = {
      onsuccess: null,
      set onerror(handler: ((event: Event) => void) | null) {
        onerrorHandler = handler;
        if (handler) {
          setTimeout(() => handler(new Event('error')), 0);
        }
      },
      get onerror() {
        return onerrorHandler;
      },
    } as unknown as IDBRequest;

    const mockStore = {} as IDBObjectStore;
    const mockTransaction = {
      objectStore: vi.fn(() => mockStore),
    } as unknown as IDBTransaction;

    const mockDatabase = {
      transaction: vi.fn(() => mockTransaction),
    } as unknown as IDBDatabase;

    vi.mocked(database.getDatabase).mockResolvedValue(mockDatabase);

    const mockOperation = vi.fn(() => mockRequest);

    await expect(
      executeIndexedDBOperation({
        storeName: STORE_NAME,
        mode: 'readwrite',
        operation: mockOperation,
        errorMessage: ERROR_MESSAGE,
      })
    ).rejects.toThrow(ERROR_MESSAGE);
  });

  it('должен использовать режим readwrite', async () => {
    let onsuccessHandler: ((event: Event) => void) | null = null;

    const mockRequest = {
      result: TEST_VALUE,
      set onsuccess(handler: ((event: Event) => void) | null) {
        onsuccessHandler = handler;
        if (handler) {
          setTimeout(() => handler(new Event('success')), 0);
        }
      },
      get onsuccess() {
        return onsuccessHandler;
      },
      onerror: null,
    } as unknown as IDBRequest;

    const mockStore = {} as IDBObjectStore;
    const mockTransaction = {
      objectStore: vi.fn(() => mockStore),
    } as unknown as IDBTransaction;

    const mockDatabase = {
      transaction: vi.fn(() => mockTransaction),
    } as unknown as IDBDatabase;

    vi.mocked(database.getDatabase).mockResolvedValue(mockDatabase);

    const mockOperation = vi.fn(() => mockRequest);

    await executeIndexedDBOperation({
      storeName: STORE_NAME,
      mode: 'readwrite',
      operation: mockOperation,
      errorMessage: 'Test error',
    });

    expect(mockDatabase.transaction).toHaveBeenCalledWith(
      [STORE_NAME],
      'readwrite'
    );
  });
});
