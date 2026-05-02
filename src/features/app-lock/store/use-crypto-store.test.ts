import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as sharedLib from '@shared/lib';
import { useCryptoStore } from './use-crypto-store';

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    deriveKeyFromPassword: vi.fn(),
    loadOrCreateSalt: vi.fn(),
    saveVerificationToken: vi.fn(),
    verifyMasterPassword: vi.fn(),
  };
});

const mockKey = { type: 'secret', algorithm: { name: 'AES-GCM' } } as CryptoKey;

const resetStore = () => {
  useCryptoStore.setState({
    cryptoKey: null,
    isUnlocked: false,
    isFirstSetup: true,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  resetStore();
  vi.mocked(sharedLib.deriveKeyFromPassword).mockResolvedValue(mockKey);
});

afterEach(() => {
  resetStore();
});

describe('useCryptoStore - начальное состояние', () => {
  it('должен быть заблокирован', () => {
    expect(useCryptoStore.getState().isUnlocked).toBe(false);
  });

  it('cryptoKey должен быть null', () => {
    expect(useCryptoStore.getState().cryptoKey).toBeNull();
  });
});

describe('useCryptoStore - unlock (первая установка)', () => {
  beforeEach(() => {
    vi.mocked(sharedLib.loadOrCreateSalt).mockReturnValue({
      salt: new Uint8Array(16),
      isNew: true,
    });
    vi.mocked(sharedLib.saveVerificationToken).mockResolvedValue(undefined);
  });

  it('должен установить isUnlocked=true', async () => {
    await useCryptoStore.getState().unlock('my-password');

    expect(useCryptoStore.getState().isUnlocked).toBe(true);
  });

  it('должен сохранить cryptoKey', async () => {
    await useCryptoStore.getState().unlock('my-password');

    expect(useCryptoStore.getState().cryptoKey).toBe(mockKey);
  });

  it('должен установить isFirstSetup=false', async () => {
    await useCryptoStore.getState().unlock('my-password');

    expect(useCryptoStore.getState().isFirstSetup).toBe(false);
  });

  it('должен сохранить токен верификации', async () => {
    await useCryptoStore.getState().unlock('my-password');

    expect(sharedLib.saveVerificationToken).toHaveBeenCalledWith(mockKey);
  });

  it('должен вывести ключ из пароля и соли', async () => {
    const salt = new Uint8Array(16);
    vi.mocked(sharedLib.loadOrCreateSalt).mockReturnValue({
      salt,
      isNew: true,
    });

    await useCryptoStore.getState().unlock('my-password');

    expect(sharedLib.deriveKeyFromPassword).toHaveBeenCalledWith(
      'my-password',
      salt,
    );
  });
});

describe('useCryptoStore - unlock (повторный вход)', () => {
  beforeEach(() => {
    useCryptoStore.setState({ isFirstSetup: false });
    vi.mocked(sharedLib.loadOrCreateSalt).mockReturnValue({
      salt: new Uint8Array(16),
      isNew: false,
    });
  });

  it('должен разблокировать при верном пароле', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(true);

    await useCryptoStore.getState().unlock('correct-password');

    expect(useCryptoStore.getState().isUnlocked).toBe(true);
    expect(useCryptoStore.getState().cryptoKey).toBe(mockKey);
  });

  it('должен выбросить ошибку и не разблокировать при неверном пароле', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(false);

    await expect(
      useCryptoStore.getState().unlock('wrong-password'),
    ).rejects.toThrow();

    expect(useCryptoStore.getState().isUnlocked).toBe(false);
    expect(useCryptoStore.getState().cryptoKey).toBeNull();
  });

  it('не должен вызывать saveVerificationToken при повторном входе', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(true);

    await useCryptoStore.getState().unlock('correct-password');

    expect(sharedLib.saveVerificationToken).not.toHaveBeenCalled();
  });
});

describe('useCryptoStore - lock', () => {
  it('должен сбросить isUnlocked в false', () => {
    useCryptoStore.setState({ cryptoKey: mockKey, isUnlocked: true });

    useCryptoStore.getState().lock();

    expect(useCryptoStore.getState().isUnlocked).toBe(false);
  });

  it('должен очистить cryptoKey', () => {
    useCryptoStore.setState({ cryptoKey: mockKey, isUnlocked: true });

    useCryptoStore.getState().lock();

    expect(useCryptoStore.getState().cryptoKey).toBeNull();
  });
});
