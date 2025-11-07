import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardFormSubmit } from './use-card-form-submit';
import type { IBankCard } from '@entities/bank-card';
import * as sharedLib from '@shared/lib';

const mockAddCard = vi.fn();
const mockUpdateCard = vi.fn();
const mockDeleteCard = vi.fn();

vi.mock('@features/card-management', () => ({
  useCardManagementStore: () => ({
    addCard: mockAddCard,
    updateCard: mockUpdateCard,
    deleteCard: mockDeleteCard,
  }),
}));

vi.mock('@shared/lib', async () => {
  const actual =
    await vi.importActual<typeof import('@shared/lib')>('@shared/lib');

  return {
    ...actual,
    checkCardExists: vi.fn(),
    logError: vi.fn(),
  };
});

describe('useCardFormSubmit', () => {
  const mockSetErrors = vi.fn();
  const mockSetIsSubmitting = vi.fn();
  const mockResetForm = vi.fn();
  const mockResetErrors = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddCard.mockReset();
    mockUpdateCard.mockReset();
    mockDeleteCard.mockReset();
  });

  describe('handleSubmit - валидация', () => {
    it('должен вызывать preventDefault', async () => {
      const formData: Partial<IBankCard> = {
        pan: '1234',
      };

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        })
      );

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('должен показывать ошибки валидации при невалидных данных', async () => {
      const formData: Partial<IBankCard> = {
        pan: '',
        expires: '',
        name: '',
        cvv: '',
        pin: '',
      };

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockSetErrors).toHaveBeenCalled();
      const errors = mockSetErrors.mock.calls[0][0];
      expect(errors.pan).toBeDefined();
      expect(mockAddCard).not.toHaveBeenCalled();
    });
  });

  describe('handleDelete', () => {
    it('должен удалять карту при наличии originalPan', async () => {
      const formData: Partial<IBankCard> = {};

      mockDeleteCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5536914125525541',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
          onSuccess: mockOnSuccess,
        })
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockDeleteCard).toHaveBeenCalledWith('5536914125525541');
      expect(mockResetForm).toHaveBeenCalled();
      expect(mockResetErrors).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('не должен удалять карту при отсутствии originalPan', async () => {
      const formData: Partial<IBankCard> = {};

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        })
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteCard).not.toHaveBeenCalled();
      expect(mockSetIsSubmitting).not.toHaveBeenCalled();
    });

    it('должен обрабатывать ошибки при удалении', async () => {
      const formData: Partial<IBankCard> = {};
      const testError = new Error('Delete error');

      mockDeleteCard.mockRejectedValue(testError);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5536914125525541',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        })
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(sharedLib.logError).toHaveBeenCalledWith({
        message: 'Failed to delete card',
        error: testError,
        context: 'CardFormDelete',
      });
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('не должен вызывать onSuccess если его нет', async () => {
      const formData: Partial<IBankCard> = {};

      mockDeleteCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5536914125525541',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        })
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteCard).toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('должен устанавливать isSubmitting в false даже при ошибке', async () => {
      const formData: Partial<IBankCard> = {};
      const testError = new Error('Delete error');

      mockDeleteCard.mockRejectedValue(testError);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5536914125525541',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        })
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });
  });

  describe('интеграция с параметрами', () => {
    it('должен корректно работать с переданными функциями-коллбеками', async () => {
      const formData: Partial<IBankCard> = {};

      mockDeleteCard.mockResolvedValue(undefined);

      const customResetForm = vi.fn();
      const customResetErrors = vi.fn();

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5536914125525541',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: customResetForm,
          resetErrors: customResetErrors,
          onSuccess: mockOnSuccess,
        })
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(customResetForm).toHaveBeenCalled();
      expect(customResetErrors).toHaveBeenCalled();
    });

    it('должен возвращать функции handleSubmit и handleDelete', () => {
      const formData: Partial<IBankCard> = {};

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        })
      );

      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.handleDelete).toBe('function');
    });
  });
});
