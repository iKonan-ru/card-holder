import { type ChangeEvent, type SubmitEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LOCK_SCREEN_ERROR_MISMATCH,
  LOCK_SCREEN_ERROR_TOO_SHORT,
  LOCK_SCREEN_ERROR_WRONG_PASSWORD,
} from '../constants';
import { useCryptoStore } from '../store';
import { useLockScreenForm } from './use-lock-screen-form';

vi.mock('../store', () => ({
  useCryptoStore: vi.fn(),
}));

const mockUnlock = vi.fn();

const setupUnlockMode = () => {
  vi.mocked(useCryptoStore).mockReturnValue({
    isFirstSetup: false,
    unlock: mockUnlock,
  } as ReturnType<typeof useCryptoStore>);
};

const setupFirstSetupMode = () => {
  vi.mocked(useCryptoStore).mockReturnValue({
    isFirstSetup: true,
    unlock: mockUnlock,
  } as ReturnType<typeof useCryptoStore>);
};

const makeChangeEvent = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

const makeSubmitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

beforeEach(() => {
  mockUnlock.mockReset();
});

describe('useLockScreenForm - начальное состояние', () => {
  it('должен инициализироваться с пустыми полями', () => {
    setupUnlockMode();

    const { result } = renderHook(() => useLockScreenForm());

    expect(result.current.password).toBe('');
    expect(result.current.confirmPassword).toBe('');
    expect(result.current.passwordError).toBeUndefined();
    expect(result.current.confirmError).toBeUndefined();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isPasswordVisible).toBe(false);
    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('должен возвращать isFirstSetup из стора', () => {
    setupFirstSetupMode();

    const { result } = renderHook(() => useLockScreenForm());

    expect(result.current.isFirstSetup).toBe(true);
  });
});

describe('useLockScreenForm - handlePasswordChange', () => {
  it('должен обновлять password', () => {
    setupUnlockMode();

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    expect(result.current.password).toBe('12345678');
  });

  it('должен сбрасывать passwordError при изменении пароля', () => {
    setupUnlockMode();
    mockUnlock.mockRejectedValueOnce(
      new Error(LOCK_SCREEN_ERROR_WRONG_PASSWORD),
    );

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    act(() => {
      result.current.handleSubmit(makeSubmitEvent());
    });

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('newpass'));
    });

    expect(result.current.passwordError).toBeUndefined();
  });
});

describe('useLockScreenForm - handleConfirmChange', () => {
  it('должен обновлять confirmPassword', () => {
    setupFirstSetupMode();

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handleConfirmChange(makeChangeEvent('12345678'));
    });

    expect(result.current.confirmPassword).toBe('12345678');
  });

  it('должен сбрасывать confirmError при изменении подтверждения', () => {
    setupFirstSetupMode();

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
      result.current.handleConfirmChange(makeChangeEvent('87654321'));
    });

    const event = makeSubmitEvent();

    act(() => {
      result.current.handleSubmit(event);
    });

    act(() => {
      result.current.handleConfirmChange(makeChangeEvent('newvalue'));
    });

    expect(result.current.confirmError).toBeUndefined();
  });
});

describe('useLockScreenForm - handleVisibilityChange', () => {
  it('должен переключать isPasswordVisible', () => {
    setupUnlockMode();

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handleVisibilityChange(true);
    });

    expect(result.current.isPasswordVisible).toBe(true);

    act(() => {
      result.current.handleVisibilityChange(false);
    });

    expect(result.current.isPasswordVisible).toBe(false);
  });
});

describe('useLockScreenForm - isSubmitEnabled', () => {
  it('должен быть false при пустом пароле', () => {
    setupUnlockMode();

    const { result } = renderHook(() => useLockScreenForm());

    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('должен быть true при достаточной длине пароля (режим разблокировки)', () => {
    setupUnlockMode();

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    expect(result.current.isSubmitEnabled).toBe(true);
  });

  it('должен быть false если пароли не совпадают (режим установки)', () => {
    setupFirstSetupMode();

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
      result.current.handleConfirmChange(makeChangeEvent('87654321'));
    });

    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('должен быть true когда пароли совпадают (режим установки)', () => {
    setupFirstSetupMode();

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
      result.current.handleConfirmChange(makeChangeEvent('12345678'));
    });

    expect(result.current.isSubmitEnabled).toBe(true);
  });
});

describe('useLockScreenForm - handleSubmit', () => {
  it('должен вызвать unlock с паролем при успешной отправке', async () => {
    setupUnlockMode();
    mockUnlock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLockScreenForm());
    const event = makeSubmitEvent();

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockUnlock).toHaveBeenCalledWith('12345678');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('должен установить passwordError если пароль слишком короткий', async () => {
    setupUnlockMode();

    const { result } = renderHook(() => useLockScreenForm());
    const event = makeSubmitEvent();

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('1234'));
    });

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.passwordError).toBe(LOCK_SCREEN_ERROR_TOO_SHORT);
    expect(mockUnlock).not.toHaveBeenCalled();
  });

  it('должен установить confirmError если пароли не совпадают', async () => {
    setupFirstSetupMode();

    const { result } = renderHook(() => useLockScreenForm());
    const event = makeSubmitEvent();

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
      result.current.handleConfirmChange(makeChangeEvent('87654321'));
    });

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.confirmError).toBe(LOCK_SCREEN_ERROR_MISMATCH);
    expect(mockUnlock).not.toHaveBeenCalled();
  });

  it('должен установить passwordError при неверном пароле', async () => {
    setupUnlockMode();
    mockUnlock.mockRejectedValueOnce(
      new Error(LOCK_SCREEN_ERROR_WRONG_PASSWORD),
    );

    const { result } = renderHook(() => useLockScreenForm());
    const event = makeSubmitEvent();

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.passwordError).toBe(LOCK_SCREEN_ERROR_WRONG_PASSWORD);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('должен сбросить isSubmitting после завершения', async () => {
    setupUnlockMode();
    mockUnlock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLockScreenForm());

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});
