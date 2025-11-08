import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardForm } from './use-card-form';
import * as sharedLib from '@shared/lib';

const { mockUseCardManagementStore } = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    checkCardExists: vi.fn(),
  };
});

const createMockStore = (overrides = {}) => ({
  cards: [],
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
  enableReorderMode: vi.fn(),
  disableReorderMode: vi.fn(),
  toggleReorderMode: vi.fn(),
  ...overrides,
});

describe('useCardForm', () => {
  const mockAddCard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const mockStoreValue = createMockStore({ addCard: mockAddCard });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    vi.mocked(sharedLib.checkCardExists).mockResolvedValue(false);
  });

  it('должен инициализироваться с пустыми данными', () => {
    const { result } = renderHook(() => useCardForm());

    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      type: '',
      phrase: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
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
    } as unknown as React.FormEvent<HTMLFormElement>;

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
    } as unknown as React.FormEvent<HTMLFormElement>;

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
      })
    );
    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      type: '',
      phrase: '',
    });
    expect(result.current.errors).toEqual({});
  });

  it('должен вызывать onSuccess после успешного добавления', async () => {
    const mockOnSuccess = vi.fn();
    const { result } = renderHook(() =>
      useCardForm({ onSuccess: mockOnSuccess })
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
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('должен показывать ошибку при попытке добавить существующую карту', async () => {
    vi.mocked(sharedLib.checkCardExists).mockResolvedValueOnce(true);

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
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockAddCard).not.toHaveBeenCalled();
    expect(result.current.errors.pan).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('должен сбрасывать форму через handleReset', () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.handleFieldChange('name', 'JOHN DOE');
      result.current.handleFieldValidation('pan', 'Ошибка');
    });

    expect(result.current.formData.name).toBe('JOHN DOE');
    expect(result.current.errors.pan).toBe('Ошибка');

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.formData.name).toBe('');
    expect(result.current.errors).toEqual({});
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
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardFormSubmit] Failed to add card',
      mockError
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
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('должен инициализироваться с данными карты в режиме редактирования', () => {
    const initialCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
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

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    act(() => {
      result.current.handleFieldChange('name', 'JANE DOE');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

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
      })
    );
  });

  it('должен обновлять карту с изменением PAN', async () => {
    const mockUpdateCard = vi.fn();
    const mockDeleteCard = vi.fn();
    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      updateCard: mockUpdateCard,
      deleteCard: mockDeleteCard,
    });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    act(() => {
      result.current.handleFieldChange('pan', '4377 7237 6924 3191');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockDeleteCard).toHaveBeenCalledWith('5555555555554444');
    expect(mockUpdateCard).toHaveBeenCalledWith(
      expect.objectContaining({
        pan: '4377723769243191',
        expires: '1225',
        name: 'JOHN DOE',
        cvv: '123',
        pin: '1234',
      })
    );
  });

  it('должен показывать ошибку при попытке изменить PAN на существующий', async () => {
    vi.mocked(sharedLib.checkCardExists).mockResolvedValueOnce(true);

    const initialCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    act(() => {
      result.current.handleFieldChange('pan', '4377 7237 6924 3191');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

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

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
    };

    const { result } = renderHook(() =>
      useCardForm({ initialCard, onSuccess: mockOnSuccess })
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDeleteCard).toHaveBeenCalledWith('5555555555554444');
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      type: '',
      phrase: '',
    });
  });

  it('handleDelete не должна удалять если нет originalPan', async () => {
    const mockDeleteCard = vi.fn();

    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      deleteCard: mockDeleteCard,
    });

    mockUseCardManagementStore.mockImplementation((selector) => {
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

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    const initialCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
    };

    const { result } = renderHook(() => useCardForm({ initialCard }));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [CardFormDelete] Failed to delete card',
      mockError
    );
    expect(result.current.isSubmitting).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
