import { type ChangeEvent, type FormEvent } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Procedure } from '@shared/types';
import type { TPasswordModalMode } from '../types';
import { usePasswordModal } from './use-password-modal';

const mockCloseModal = vi.fn();

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    useModalClose: () => mockCloseModal,
    useAnimatedModalClose: (callback?: Procedure) => callback || vi.fn(),
  };
});

describe('usePasswordModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('режим экспорта', () => {
    const mode: TPasswordModalMode = 'export';
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    it('должен инициализироваться с пустыми значениями', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.password).toBe('');
      expect(result.current.confirmPassword).toBe('');
      expect(result.current.passwordError).toBeUndefined();
      expect(result.current.confirmError).toBeUndefined();
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isPasswordVisible).toBe(false);
    });

    it('должен устанавливать isExportMode в true', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.isExportMode).toBe(true);
    });

    it('должен возвращать заголовок экспорта', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.title).toBe('Экспорт карт');
    });

    it('должен возвращать текст кнопки экспорта', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.buttonText).toBe('Экспортировать');
    });

    it('должен обновлять пароль при handlePasswordChange', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      const event = {
        target: { value: 'newpassword' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(event);
      });

      expect(result.current.password).toBe('newpassword');
    });

    it('должен очищать ошибки при изменении пароля', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      act(() => {
        result.current.handleSubmit(mockFormEvent);
      });

      expect(result.current.passwordError).toBeDefined();

      const event = {
        target: { value: 'newpassword' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(event);
      });

      expect(result.current.passwordError).toBeUndefined();
      expect(result.current.confirmError).toBeUndefined();
    });

    it('должен обновлять confirmPassword при handleConfirmPasswordChange', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      const event = {
        target: { value: 'confirmedpassword' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleConfirmPasswordChange(event);
      });

      expect(result.current.confirmPassword).toBe('confirmedpassword');
    });

    it('должен переключать видимость пароля', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.isPasswordVisible).toBe(false);

      act(() => {
        result.current.handlePasswordVisibilityChange(true);
      });

      expect(result.current.isPasswordVisible).toBe(true);
    });

    it('должен показывать ошибку при коротком пароле', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      const passwordEvent = {
        target: { value: 'short' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      act(() => {
        result.current.handleSubmit(mockFormEvent);
      });

      expect(result.current.passwordError).toBe('Введите минимум 8 символов');
    });

    it('должен показывать ошибку при несовпадении паролей', () => {
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      const passwordEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      const confirmEvent = {
        target: { value: 'password456' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
        result.current.handleConfirmPasswordChange(confirmEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      act(() => {
        result.current.handleSubmit(mockFormEvent);
      });

      expect(result.current.confirmError).toBe('Пароли не совпадают');
    });

    it('должен вызывать onConfirm при валидных данных', async () => {
      const mockOnConfirm = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm: mockOnConfirm, onCancel })
      );

      const passwordEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      const confirmEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
        result.current.handleConfirmPasswordChange(confirmEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockFormEvent);
      });

      expect(mockOnConfirm).toHaveBeenCalledWith(
        'password123',
        mockCloseModal,
        expect.any(Function)
      );
    });

    it('должен устанавливать isSubmitting в true во время отправки', async () => {
      let resolvePromise: Procedure;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      const mockOnConfirm = vi.fn().mockReturnValue(promise);

      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm: mockOnConfirm, onCancel })
      );

      const passwordEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      const confirmEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
        result.current.handleConfirmPasswordChange(confirmEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      act(() => {
        result.current.handleSubmit(mockFormEvent);
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      act(() => {
        resolvePromise!();
      });
    });

    it('должен сбрасывать isSubmitting при ошибке', async () => {
      const mockOnConfirm = vi.fn().mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm: mockOnConfirm, onCancel })
      );

      const passwordEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      const confirmEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
        result.current.handleConfirmPasswordChange(confirmEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockFormEvent);
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it('должен устанавливать ошибку пароля через setError колбэк', async () => {
      const mockOnConfirm = vi
        .fn()
        .mockImplementation(
          async (
            _password: string,
            _closeModal: Procedure,
            setError: (error: string) => void
          ) => {
            setError('Неверный пароль');
          }
        );

      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm: mockOnConfirm, onCancel })
      );

      const passwordEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      const confirmEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
        result.current.handleConfirmPasswordChange(confirmEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockFormEvent);
      });

      expect(result.current.passwordError).toBe('Неверный пароль');
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('режим импорта', () => {
    const mode: TPasswordModalMode = 'import';

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('должен устанавливать isExportMode в false', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.isExportMode).toBe(false);
    });

    it('должен возвращать заголовок импорта', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.title).toBe('Импорт карт');
    });

    it('должен возвращать текст кнопки импорта', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      const { result } = renderHook(() =>
        usePasswordModal({ mode, onConfirm, onCancel })
      );

      expect(result.current.buttonText).toBe('Импортировать');
    });

    it('не должен валидировать длину пароля в режиме импорта', async () => {
      const mockOnConfirm = vi.fn().mockResolvedValue(undefined);
      const mockOnCancel = vi.fn();
      const { result } = renderHook(() =>
        usePasswordModal({
          mode,
          onConfirm: mockOnConfirm,
          onCancel: mockOnCancel,
        })
      );

      const passwordEvent = {
        target: { value: 'short' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockFormEvent);
      });

      expect(result.current.passwordError).toBeUndefined();
      expect(mockOnConfirm).toHaveBeenCalled();
    });

    it('не должен требовать confirmPassword в режиме импорта', async () => {
      const mockOnConfirm = vi.fn().mockResolvedValue(undefined);
      const mockOnCancel = vi.fn();
      const { result } = renderHook(() =>
        usePasswordModal({
          mode,
          onConfirm: mockOnConfirm,
          onCancel: mockOnCancel,
        })
      );

      const passwordEvent = {
        target: { value: 'password123' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(passwordEvent);
      });

      const mockFormEvent = {
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockFormEvent);
      });

      expect(mockOnConfirm).toHaveBeenCalledWith(
        'password123',
        mockCloseModal,
        expect.any(Function)
      );
    });
  });

  describe('handleCancel', () => {
    it('должен вызывать onCancel', () => {
      const mockOnCancel = vi.fn();
      const { result } = renderHook(() =>
        usePasswordModal({
          mode: 'export',
          onConfirm: vi.fn(),
          onCancel: mockOnCancel,
        })
      );

      act(() => {
        result.current.handleCancel();
      });

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('должен работать без onCancel', () => {
      const { result } = renderHook(() =>
        usePasswordModal({
          mode: 'export',
          onConfirm: vi.fn(),
        })
      );

      expect(() => {
        act(() => {
          result.current.handleCancel();
        });
      }).not.toThrow();
    });
  });
});
