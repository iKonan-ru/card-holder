import { type SubmitEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCardFormSubmit } from '@features/card-form';
import type { IBankCard } from '@entities/bank-card';
import * as sharedLib from '@shared/lib';
import * as validationModule from '../utils/validation';

const mockAddCard = vi.fn();
const mockUpdateCard = vi.fn();
const mockDeleteCard = vi.fn();

const mockStoreState = {
  cards: [] as IBankCard[],
};

vi.mock('@features/card-management', () => ({
  useCardManagementStore: () => ({
    get cards() {
      return mockStoreState.cards;
    },
    isLoading: false,
    flippedPan: null,
    isReorderMode: false,
    addCard: mockAddCard,
    updateCard: mockUpdateCard,
    deleteCard: mockDeleteCard,
    loadCards: vi.fn(),
    flipCard: vi.fn(),
    unflipCards: vi.fn(),
    setCards: vi.fn(),
    reorderCards: vi.fn(),
    setReorderMode: vi.fn(),
    toggleReorderMode: vi.fn(),
  }),
}));

vi.mock('@shared/lib', async () => {
  const actual =
    await vi.importActual<typeof import('@shared/lib')>('@shared/lib');

  return {
    ...actual,
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
    mockStoreState.cards = [];
  });

  describe('handleSubmit - валидация', () => {
    it('должен вызывать preventDefault', async () => {
      const formData: Partial<IBankCard> = {
        pan: '1234',
      };

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
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
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

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
    it('должен удалять карту при наличии formData.id', async () => {
      const formData: Partial<IBankCard> = {
        id: 'card-to-delete-id',
      };

      mockDeleteCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
          onSuccess: mockOnSuccess,
        }),
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockDeleteCard).toHaveBeenCalledWith('card-to-delete-id');
      expect(mockResetForm).toHaveBeenCalled();
      expect(mockResetErrors).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('не должен удалять карту при отсутствии formData.id', async () => {
      const formData: Partial<IBankCard> = {};

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteCard).not.toHaveBeenCalled();
      expect(mockSetIsSubmitting).not.toHaveBeenCalled();
    });

    it('должен обрабатывать ошибки при удалении', async () => {
      const formData: Partial<IBankCard> = {
        id: 'card-to-delete-id',
      };
      const testError = new Error('Delete error');

      mockDeleteCard.mockRejectedValue(testError);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(sharedLib.logError).toHaveBeenCalledWith({
        message: 'Не удалось удалить карту',
        error: testError,
        context: 'CardFormDelete',
      });
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('не должен вызывать onSuccess если его нет', async () => {
      const formData: Partial<IBankCard> = {
        id: 'card-to-delete-id',
      };

      mockDeleteCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteCard).toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('должен устанавливать isSubmitting в false даже при ошибке', async () => {
      const formData: Partial<IBankCard> = {
        id: 'card-to-delete-id',
      };
      const testError = new Error('Delete error');

      mockDeleteCard.mockRejectedValue(testError);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });
  });

  describe('handleSubmit - добавление карты', () => {
    it('должен добавлять карту при валидных данных', async () => {
      const formData: Partial<IBankCard> = {
        pan: '5559494202595236',
        expires: '1230',
        name: 'TEST USER',
        cvv: '123',
        pin: '1234',
      };

      mockAddCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
          onSuccess: mockOnSuccess,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockAddCard).toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalled();
      expect(mockResetErrors).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('должен показать ошибку если карта уже существует (in-memory)', async () => {
      const existingPan = '5559494202595236';

      mockStoreState.cards = [
        {
          id: 'existing-id',
          pan: existingPan,
          expires: '1230',
          name: 'EXISTING',
          cvv: '123',
          order: 0,
        },
      ];

      const formData: Partial<IBankCard> = {
        pan: existingPan,
        expires: '1230',
        name: 'TEST USER',
        cvv: '123',
        pin: '1234',
      };

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockSetErrors).toHaveBeenCalledWith({
        pan: 'Такая карта уже существует',
      });
      expect(mockAddCard).not.toHaveBeenCalled();
    });
  });

  describe('handleSubmit - редактирование карты', () => {
    it('должен обновлять карту при валидных данных', async () => {
      const formData: Partial<IBankCard> = {
        id: 'edit-card-id',
        pan: '5559494202595236',
        expires: '1230',
        name: 'UPDATED USER',
        cvv: '123',
        pin: '1234',
        order: 0,
      };

      mockUpdateCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5559494202595236',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
          onSuccess: mockOnSuccess,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockUpdateCard).toHaveBeenCalled();
      expect(mockDeleteCard).not.toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalled();
      expect(mockResetErrors).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('должен обновлять карту при изменении PAN без вызова deleteCard', async () => {
      const formData: Partial<IBankCard> = {
        id: 'edit-card-id',
        pan: '4377723769243191',
        expires: '1230',
        name: 'UPDATED USER',
        cvv: '123',
        pin: '1234',
        order: 0,
      };

      mockUpdateCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5559494202595236',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
          onSuccess: mockOnSuccess,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockUpdateCard).toHaveBeenCalled();
      expect(mockDeleteCard).not.toHaveBeenCalled();
    });

    it('должен показать ошибку если новый PAN уже существует у другой карты', async () => {
      const newPan = '4377723769243191';

      mockStoreState.cards = [
        {
          id: 'other-card-id',
          pan: newPan,
          expires: '1230',
          name: 'OTHER CARD',
          cvv: '456',
          order: 1,
        },
      ];

      const formData: Partial<IBankCard> = {
        id: 'edit-card-id',
        pan: newPan,
        expires: '1230',
        name: 'UPDATED USER',
        cvv: '123',
        pin: '1234',
        order: 0,
      };

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5559494202595236',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockSetErrors).toHaveBeenCalledWith({
        pan: 'Такая карта уже существует',
      });
      expect(mockUpdateCard).not.toHaveBeenCalled();
    });

    it('не должен показывать ошибку при редактировании без изменения PAN (исключает себя)', async () => {
      const currentPan = '5559494202595236';
      const currentId = 'edit-card-id';

      mockStoreState.cards = [
        {
          id: currentId,
          pan: currentPan,
          expires: '1230',
          name: 'CURRENT',
          cvv: '123',
          order: 0,
        },
      ];

      const formData: Partial<IBankCard> = {
        id: currentId,
        pan: currentPan,
        expires: '1230',
        name: 'UPDATED USER',
        cvv: '123',
        pin: '1234',
        order: 0,
      };

      mockUpdateCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: currentPan,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockUpdateCard).toHaveBeenCalled();
      expect(mockSetErrors).not.toHaveBeenCalledWith({
        pan: 'Такая карта уже существует',
      });
    });
  });

  describe('интеграция с параметрами', () => {
    it('должен корректно работать с переданными функциями-коллбеками', async () => {
      const formData: Partial<IBankCard> = {
        id: 'card-to-delete-id',
      };

      mockDeleteCard.mockResolvedValue(undefined);

      const customResetForm = vi.fn();
      const customResetErrors = vi.fn();

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: customResetForm,
          resetErrors: customResetErrors,
          onSuccess: mockOnSuccess,
        }),
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
        }),
      );

      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.handleDelete).toBe('function');
    });
  });

  describe('handleSubmit - невалидная карта', () => {
    it('не должен добавлять карту если checkIsValidBankCard возвращает false', async () => {
      const formData: Partial<IBankCard> = {
        pan: '5559494202595236',
        expires: '1230',
        name: 'TEST USER',
      };

      const validateCardFormSpy = vi
        .spyOn(validationModule, 'validateCardForm')
        .mockReturnValue({});
      const checkIsValidBankCardSpy = vi
        .spyOn(validationModule, 'checkIsValidBankCard')
        .mockReturnValue(false);
      mockAddCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockAddCard).not.toHaveBeenCalled();
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);

      validateCardFormSpy.mockRestore();
      checkIsValidBankCardSpy.mockRestore();
    });

    it('не должен обновлять карту если checkIsValidBankCard возвращает false', async () => {
      const formData: Partial<IBankCard> = {
        id: 'edit-card-id',
        pan: '5559494202595236',
        expires: '1230',
        name: 'UPDATED USER',
      };

      const validateCardFormSpy = vi
        .spyOn(validationModule, 'validateCardForm')
        .mockReturnValue({});
      const checkIsValidBankCardSpy = vi
        .spyOn(validationModule, 'checkIsValidBankCard')
        .mockReturnValue(false);
      mockUpdateCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          originalPan: '5559494202595236',
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockUpdateCard).not.toHaveBeenCalled();
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);

      validateCardFormSpy.mockRestore();
      checkIsValidBankCardSpy.mockRestore();
    });
  });

  describe('handleSubmit - граничные случаи', () => {
    it('должен обрабатывать случай когда cardPan пустой', async () => {
      const formData: Partial<IBankCard> = {
        pan: '',
        expires: '1230',
        name: 'TEST USER',
        cvv: '123',
        pin: '1234',
      };

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: false,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockSetErrors).toHaveBeenCalled();
    });

    it('должен обновлять карту без вызова deleteCard при изменении PAN', async () => {
      const formData: Partial<IBankCard> = {
        id: 'edit-card-id',
        pan: '4377723769243191',
        expires: '1230',
        name: 'UPDATED USER',
        cvv: '123',
        pin: '1234',
        order: 0,
      };

      mockUpdateCard.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useCardFormSubmit({
          formData,
          isEditMode: true,
          setErrors: mockSetErrors,
          setIsSubmitting: mockSetIsSubmitting,
          resetForm: mockResetForm,
          resetErrors: mockResetErrors,
          onSuccess: mockOnSuccess,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as SubmitEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockDeleteCard).not.toHaveBeenCalled();
      expect(mockUpdateCard).toHaveBeenCalled();
    });
  });
});
