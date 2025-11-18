import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act, cleanup } from '@testing-library/react';
import { useCardList } from './use-card-list';
import type { IBankCard } from '@entities/bank-card';
import type { PropsWithChildren, FC } from 'react';
import { ModalProvider } from '@shared/lib';

const {
  mockUseCardManagementStore,
  mockOpenAddCardForm,
  mockOpenEditCardForm,
} = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
  mockOpenAddCardForm: vi.fn(),
  mockOpenEditCardForm: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

vi.mock('@features/card-form', () => ({
  useCardFormModal: () => ({
    openAddCardForm: mockOpenAddCardForm,
    openEditCardForm: mockOpenEditCardForm,
  }),
}));

const MOCK_CARD: IBankCard = {
  pan: '5559494202595236',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

const TestWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <ModalProvider>{children}</ModalProvider>;
};

const createMockStore = (overrides = {}) => ({
  cards: [],
  flippedPan: null,
  isLoading: false,
  isReorderMode: false,
  flipCard: vi.fn(),
  loadCards: vi.fn(),
  addCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
  reorderCards: vi.fn(),
  setCards: vi.fn(),
  toggleReorderMode: vi.fn(),
  unflipCards: vi.fn(),
  setReorderMode: vi.fn(),
  ...overrides,
});

describe('useCardList', () => {
  const mockLoadCards = vi.fn();
  const mockReorderCards = vi.fn();
  const mockSetCards = vi.fn();
  const mockToggleReorderMode = vi.fn();
  const mockUnflipCards = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const mockStoreValue = createMockStore({
      cards: [MOCK_CARD],
      loadCards: mockLoadCards,
      reorderCards: mockReorderCards,
      setCards: mockSetCards,
      toggleReorderMode: mockToggleReorderMode,
      unflipCards: mockUnflipCards,
    });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('должен вызывать loadCards при монтировании', () => {
    renderHook(() => useCardList(), { wrapper: TestWrapper });

    expect(mockLoadCards).toHaveBeenCalledTimes(1);
  });

  it('должен возвращать данные из store', () => {
    const { result } = renderHook(() => useCardList(), {
      wrapper: TestWrapper,
    });

    expect(result.current.cards).toEqual([MOCK_CARD]);
    expect(result.current.isReorderMode).toBe(false);
  });

  it('должен вызывать toggleReorderMode при вызове handleToggleReorderMode', () => {
    const { result } = renderHook(() => useCardList(), {
      wrapper: TestWrapper,
    });

    result.current.handleToggleReorderMode();

    expect(mockToggleReorderMode).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать setCards и reorderCards при handleDragEnd', async () => {
    const { result } = renderHook(() => useCardList(), {
      wrapper: TestWrapper,
    });

    const reorderedCards = [MOCK_CARD];

    result.current.handleDragEnd(reorderedCards);

    expect(mockSetCards).toHaveBeenCalledWith(reorderedCards);
    expect(mockReorderCards).toHaveBeenCalledWith(reorderedCards);
  });

  it('handleShowForm должен открывать модальное окно', () => {
    const { result } = renderHook(() => useCardList(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.handleShowForm();
    });

    expect(mockOpenAddCardForm).toHaveBeenCalled();
  });

  it('handleEditCard должен открывать модальное окно с карточкой', () => {
    const { result } = renderHook(() => useCardList(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.handleEditCard(MOCK_CARD);
    });

    expect(mockUnflipCards).not.toHaveBeenCalled();
  });

  it('не должен вызывать loadCards повторно при обновлении', async () => {
    const { rerender } = renderHook(() => useCardList(), {
      wrapper: TestWrapper,
    });

    mockLoadCards.mockClear();

    rerender();

    await waitFor(() => {
      expect(mockLoadCards).not.toHaveBeenCalled();
    });
  });
});
