/**
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MASTER_KEY_SALT_STORAGE_KEY,
  PASSWORD_VERIFY_STORAGE_KEY,
} from './constants';
import {
  loadOrCreateSalt,
  saveVerificationToken,
  verifyMasterPassword,
} from './master-key';

let localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string): string | null => localStorageStore[key] ?? null,
  setItem: (key: string, value: string): void => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string): void => {
    delete localStorageStore[key];
  },
  clear: (): void => {
    localStorageStore = {};
  },
};

beforeEach(() => {
  localStorageStore = {};
  globalThis.localStorage = localStorageMock as unknown as Storage;
});

afterEach(() => {
  localStorageStore = {};
});

describe('loadOrCreateSalt', () => {
  it('должен создать новую соль если она отсутствует в localStorage', () => {
    const { salt, isNew } = loadOrCreateSalt();

    expect(salt).toBeInstanceOf(Uint8Array);
    expect(salt.length).toBe(16);
    expect(isNew).toBe(true);
  });

  it('должен сохранить новую соль в localStorage', () => {
    loadOrCreateSalt();

    expect(localStorageStore[MASTER_KEY_SALT_STORAGE_KEY]).toBeDefined();
  });

  it('должен вернуть isNew=false при повторном вызове', () => {
    loadOrCreateSalt();
    const { isNew } = loadOrCreateSalt();

    expect(isNew).toBe(false);
  });

  it('должен возвращать ту же соль при повторном вызове', () => {
    const { salt: first } = loadOrCreateSalt();
    const { salt: second } = loadOrCreateSalt();

    expect(first).toEqual(second);
  });

  it('должен генерировать разные соли при разных вызовах с чистым localStorage', () => {
    const { salt: first } = loadOrCreateSalt();
    localStorageStore = {};
    const { salt: second } = loadOrCreateSalt();

    expect(first).not.toEqual(second);
  });
});

describe('saveVerificationToken', () => {
  it('должен сохранить токен в localStorage', async () => {
    const { salt } = loadOrCreateSalt();
    const { deriveKeyFromPassword } = await import('./key-derivation');
    const key = await deriveKeyFromPassword('test-password', salt);

    await saveVerificationToken(key);

    expect(localStorageStore[PASSWORD_VERIFY_STORAGE_KEY]).toBeDefined();
    expect(
      localStorageStore[PASSWORD_VERIFY_STORAGE_KEY].length,
    ).toBeGreaterThan(0);
  });

  it('токен должен быть валидной строкой base64', async () => {
    const { salt } = loadOrCreateSalt();
    const { deriveKeyFromPassword } = await import('./key-derivation');
    const key = await deriveKeyFromPassword('test-password', salt);

    await saveVerificationToken(key);

    expect(() =>
      atob(localStorageStore[PASSWORD_VERIFY_STORAGE_KEY]),
    ).not.toThrow();
  });
});

describe('verifyMasterPassword', () => {
  it('должен вернуть false если токен верификации отсутствует', async () => {
    const result = await verifyMasterPassword('any-password');

    expect(result).toBe(false);
  });

  it('должен вернуть true для верного пароля после сохранения токена', async () => {
    const password = 'correct-password-123';
    const { salt } = loadOrCreateSalt();
    const { deriveKeyFromPassword } = await import('./key-derivation');
    const key = await deriveKeyFromPassword(password, salt);
    await saveVerificationToken(key);

    const result = await verifyMasterPassword(password);

    expect(result).toBe(true);
  });

  it('должен вернуть false для неверного пароля', async () => {
    const { salt } = loadOrCreateSalt();
    const { deriveKeyFromPassword } = await import('./key-derivation');
    const key = await deriveKeyFromPassword('correct-password', salt);
    await saveVerificationToken(key);

    const result = await verifyMasterPassword('wrong-password');

    expect(result).toBe(false);
  });

  it('должен вернуть false при поврежденном токене', async () => {
    loadOrCreateSalt();
    localStorageStore[PASSWORD_VERIFY_STORAGE_KEY] = btoa('corrupted-token');

    const result = await verifyMasterPassword('any-password');

    expect(result).toBe(false);
  });
});
