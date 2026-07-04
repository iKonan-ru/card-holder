import { type SubmitEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { useCardForm } from './use-card-form';

const { mockUseCardsStore } = vi.hoisted(() => ({
  mockUseCardsStore: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardsStore: mockUseCardsStore,
}));

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
  };
});

const createMockStore = (
  overrides: Partial<{
    cards: IBankCard[];
    addCard: ReturnType<typeof vi.fn>;
    updateCard: ReturnType<typeof vi.fn>;
    deleteCard: ReturnType<typeof vi.fn>;
  }> = {},
) => ({
  cards: [] as IBankCard[],
  isLoading: false,
  flippedPan: null,
  isReorderMode: false,
  loadCards: vi.fn(),
  addCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
  flipCard: vi.fn(),
  unflipCards: vi.fn(),
  setCards: vi.fn(),
  reorderCards: vi.fn(),
  setReorderMode: vi.fn(),
  toggleReorderMode: vi.fn(),
  ...overrides,
});

describe('useCardForm', () => {
  const mockAddCard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const mockStoreValue = createMockStore({ addCard: mockAddCard });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });
  });

  it('должен инициализироваться с пустыми данными', () => {
    const { result } = renderHook(() => useCardForm());

    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      typeId: '',
      ownerId: '',
      phrase: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        county: '',
        zip: '',
      },
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('isSubmitEnabled должен быть false при пустых полях', () => {
    const { result } = renderHook(() => useCardForm());

    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('isSubmitEnabled должен быть true когда все обязательные поля заполнены', () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('pan', '5555 5555 5555 4444');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('cvv', '123');
      result.current.handleFieldChange('name', 'JOHN DOE');
    });

    expect(result.current.isSubmitEnabled).toBe(true);
  });

  it('isSubmitEnabled должен быть false если есть ошибки валидации', () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('pan', '5555 5555 5555 4444');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('cvv', '123');
      result.current.handleFieldChange('name', 'JOHN DOE');
      result.current.handleFieldValidation('pan', 'Неверный номер');
    });

    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('isSubmitEnabled должен быть false если поле не заполнено до нужной длины', () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('pan', '5555 5555');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('cvv', '123');
      result.current.handleFieldChange('name', 'JOHN DOE');
    });

    expect(result.current.isSubmitEnabled).toBe(false);
  });

  it('должен обновлять данные поля через handleFieldChange', () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('name', 'JOHN DOE');
    });

    expect(result.current.formData.name).toBe('JOHN DOE');
  });

  it('должен обновлять ошибки через handleFieldValidation', () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldValidation('pan', 'Неверный номер карты');
    });

    expect(result.current.errors.pan).toBe('Неверный номер карты');
  });

  it('должен удалять ошибку при передаче undefined', () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldValidation('pan', 'Неверный номер карты');
    });

    expect(result.current.errors.pan).toBe('Неверный номер карты');

    act(() => {
      result.current.handleFieldValidation('pan', undefined);
    });

    expect(result.current.errors.pan).toBeUndefined();
  });

  it('должен возвращать ошибки валидации при сабмите с невалидными данными', async () => {
    const { result } = renderHook(() => useCardForm());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    expect(mockAddCard).not.toHaveBeenCalled();
  });

  it('должен успешно добавлять карту с валидными данными', async () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('pan', '5555 5555 5555 4444');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('name', 'JOHN DOE');
      result.current.handleFieldChange('cvv', '123');
      result.current.handleFieldChange('pin', '1234');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockAddCard).toHaveBeenCalledWith(
      expect.objectContaining({
        pan: '5555555555554444',
        expires: '1225',
        name: 'JOHN DOE',
        cvv: '123',
        pin: '1234',
        order: 0,
      }),
    );
    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      typeId: '',
      ownerId: '',
      phrase: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        county: '',
        zip: '',
      },
    });
    expect(result.current.errors).toEqual({});
  });

  it('должен вызывать onSuccess после успешного добавления', async () => {
    const mockOnSuccess = vi.fn();
    const { result } = renderHook(() =>
      useCardForm({ onSuccess: mockOnSuccess }),
    );

    act(() => {
      result.current.handleFieldChange('pan', '5555 5555 5555 4444');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('name', 'JOHN DOE');
      result.current.handleFieldChange('cvv', '123');
      result.current.handleFieldChange('pin', '1234');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('должен показывать ошибку при попытке добавить существующую карту', async () => {
    const existingPan = '5555555555554444';
    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      cards: [
        {
          id: 'existing-id',
          pan: existingPan,
          expires: '1225',
          name: 'EXISTING',
          cvv: '123',
          order: 0,
        },
      ],
    });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('pan', '5555 5555 5555 4444');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('name', 'JOHN DOE');
      result.current.handleFieldChange('cvv', '123');
      result.current.handleFieldChange('pin', '1234');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockAddCard).not.toHaveBeenCalled();
    expect(result.current.errors.pan).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('должен обрабатывать ошибки при добавлении карты', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Database error');
    mockAddCard.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('pan', '5555 5555 5555 4444');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('name', 'JOHN DOE');
      result.current.handleFieldChange('cvv', '123');
      result.current.handleFieldChange('pin', '1234');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardFormSubmit] Не удалось добавить карту',
      mockError,
    );
    expect(result.current.isSubmitting).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('должен сбрасывать isSubmitting после завершения сабмита', async () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('pan', '5536 9141 2552 5541');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('name', 'JOHN DOE');
      result.current.handleFieldChange('cvv', '123');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('должен инициализироваться с данными карты в режиме редактирования', () => {
    const initialCard = {
      id: 'edit-id',
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    expect(result.current.isEditMode).toBe(true);
    expect(result.current.formData.pan).toBe('5555 5555 5555 4444');
    expect(result.current.formData.expires).toBe('12/25');
    expect(result.current.formData.name).toBe('JOHN DOE');
  });

  it('должен обновлять карту в режиме редактирования без изменения PAN', async () => {
    const mockUpdateCard = vi.fn();
    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      updateCard: mockUpdateCard,
    });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      id: 'edit-id',
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    act(() => {
      result.current.handleFieldChange('name', 'JANE DOE');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockUpdateCard).toHaveBeenCalledWith(
      expect.objectContaining({
        pan: '5555555555554444',
        expires: '1225',
        name: 'JANE DOE',
        cvv: '123',
        pin: '1234',
      }),
    );
  });

  it('должен обновлять карту с изменением PAN без вызова deleteCard', async () => {
    const mockUpdateCard = vi.fn();
    const mockDeleteCard = vi.fn();
    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      updateCard: mockUpdateCard,
      deleteCard: mockDeleteCard,
    });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      id: 'edit-id',
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    act(() => {
      result.current.handleFieldChange('pan', '4377 7237 6924 3191');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockDeleteCard).not.toHaveBeenCalled();
    expect(mockUpdateCard).toHaveBeenCalledWith(
      expect.objectContaining({
        pan: '4377723769243191',
        expires: '1225',
        name: 'JOHN DOE',
        cvv: '123',
        pin: '1234',
      }),
    );
  });

  it('должен показывать ошибку при попытке изменить PAN на существующий', async () => {
    const existingPan = '4377723769243191';
    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      cards: [
        {
          id: 'other-card-id',
          pan: existingPan,
          expires: '1225',
          name: 'OTHER CARD',
          cvv: '456',
          order: 1,
        },
      ],
    });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      id: 'edit-id',
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    act(() => {
      result.current.handleFieldChange('pan', '4377 7237 6924 3191');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.errors.pan).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('должен удалять карту через handleDelete', async () => {
    const mockDeleteCard = vi.fn();
    const mockOnSuccess = vi.fn();

    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      deleteCard: mockDeleteCard,
    });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      id: 'delete-card-id',
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const { result } = renderHook(() =>
      useCardForm({ initialCard, onSuccess: mockOnSuccess }),
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDeleteCard).toHaveBeenCalledWith('delete-card-id');
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      typeId: '',
      ownerId: '',
      phrase: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        county: '',
        zip: '',
      },
    });
  });

  it('handleDelete не должна удалять если нет formData.id', async () => {
    const mockDeleteCard = vi.fn();

    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      deleteCard: mockDeleteCard,
    });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const { result } = renderHook(() => useCardForm());

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDeleteCard).not.toHaveBeenCalled();
  });

  it('handleDelete должна обрабатывать ошибки при удалении', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Delete error');
    const mockDeleteCard = vi.fn().mockRejectedValueOnce(mockError);

    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      deleteCard: mockDeleteCard,
    });

    mockUseCardsStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      id: 'delete-card-id',
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardFormDelete] Не удалось удалить карту',
      mockError,
    );
    expect(result.current.isSubmitting).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
