import { type ChangeEvent, type SubmitEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as sharedLib from '@shared/lib';
import { MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD } from '../constants';
import { useMasterPasswordConfirmForm } from './use-master-password-confirm-form';

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    verifyMasterPassword: vi.fn(),
    useModalClose: vi.fn(),
    withRateLimit: vi.fn(async (op: () => Promise<unknown>) => op()),
  };
});

const mockCloseModal = vi.fn();
const mockOnConfirm = vi.fn();

const makeChangeEvent = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

const makeSubmitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(sharedLib.useModalClose).mockReturnValue(mockCloseModal);
});

describe('useMasterPasswordConfirmForm - начальное состояние', () => {
  it('должен инициализироваться с пустыми полями', () => {
    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    expect(result.current.password).toBe('');
    expect(result.current.error).toBeUndefined();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isPasswordVisible).toBe(false);
    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('должен возвращать closeModal из useModalClose', () => {
    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    expect(result.current.closeModal).toBe(mockCloseModal);
  });
});

describe('useMasterPasswordConfirmForm - handlePasswordChange', () => {
  it('должен обновлять password', () => {
    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    expect(result.current.password).toBe('12345678');
  });

  it('должен сбрасывать error при изменении пароля', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(false);

    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    expect(result.current.error).toBeDefined();

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('newpass'));
    });

    expect(result.current.error).toBeUndefined();
  });
});

describe('useMasterPasswordConfirmForm - isSubmitEnabled', () => {
  it('должен быть false при пустом пароле', () => {
    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('должен быть true при достаточной длине пароля', () => {
    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    expect(result.current.isSubmitEnabled).toBe(true);
  });
});

describe('useMasterPasswordConfirmForm - handleSubmit', () => {
  it('должен вызвать onConfirm при верном пароле', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(true);
    mockOnConfirm.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('должен закрыть модалку после успешного подтверждения', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(true);
    mockOnConfirm.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('должен показать ошибку при неверном пароле', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(false);

    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    expect(result.current.error).toBe(
      MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD,
    );
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('должен сбросить isSubmitting после завершения', async () => {
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(true);
    mockOnConfirm.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.handlePasswordChange(makeChangeEvent('12345678'));
    });

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});

describe('useMasterPasswordConfirmForm - setIsPasswordVisible', () => {
  it('должен переключать видимость пароля', () => {
    const { result } = renderHook(() =>
      useMasterPasswordConfirmForm({ onConfirm: mockOnConfirm }),
    );

    act(() => {
      result.current.setIsPasswordVisible(true);
    });

    expect(result.current.isPasswordVisible).toBe(true);
  });
});
