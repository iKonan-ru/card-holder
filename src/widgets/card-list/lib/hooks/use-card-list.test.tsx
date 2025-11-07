import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act, cleanup } from '@testing-library/react';
import { useCardList } from './use-card-list';
import { useCardManagementStore } from '@features/card-management';
import type { IBankCard } from '@entities/bank-card';
import type { ReactNode, FC } from 'react';
import { ModalProvider } from '@shared/lib';

vi.mock('@features/card-management', () => ({
  useCardManagementStore: vi.fn(),
}));

const MOCK_CARD: IBankCard = {
  pan: '5559494202595236',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

const TestWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return <ModalProvider>{children}</ModalProvider>;
};

describe('useCardList', () => {
  const mockLoadCards = vi.fn();
  const mockReorderCards = vi.fn();
  const mockSetCards = vi.fn();
  const mockToggleReorderMode = vi.fn();
  const mockUnflipCards = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCardManagementStore).mockReturnValue({
      cards: [MOCK_CARD],
      flippedPan: null,
      isLoading: false,
      isReorderMode: false,
      flipCard: vi.fn(),
      loadCards: mockLoadCards,
      addCard: vi.fn(),
      updateCard: vi.fn(),
      deleteCard: vi.fn(),
      reorderCards: mockReorderCards,
      setCards: mockSetCards,
      toggleReorderMode: mockToggleReorderMode,
      unflipCards: mockUnflipCards,
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

    expect(mockUnflipCards).toHaveBeenCalledTimes(1);
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
