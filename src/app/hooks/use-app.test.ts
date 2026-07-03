import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useApp } from '@app/hooks';
import {
  useCardManagementStore,
  type ICardManagementActions,
  type ICardManagementState,
} from '@features/card-management';
import { initGlobalErrorHandler } from '@features/error-handling';
import { setErrorModalHandler } from '@shared/lib';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: vi.fn().mockReturnValue({
    needRefresh: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: vi.fn(),
}));

vi.mock('@features/error-handling', () => ({
  initGlobalErrorHandler: vi.fn(),
  showError: vi.fn(),
}));

vi.mock('@shared/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/lib')>();

  return {
    ...actual,
    setErrorModalHandler: vi.fn(),
  };
});

describe('useApp', () => {
  const mockSetReorderMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCardManagementStore).mockImplementation((selector) => {
      const state: ICardManagementState & ICardManagementActions = {
        cards: [],
        flippedPan: null,
        isLoading: false,
        isReorderMode: false,
        sortKey: 'order',
        sortDirection: 'asc',
        groupBy: 'none',
        filters: { bankIds: [], paymentSystems: [], typeIds: [], ownerIds: [] },
        collapsedGroups: [],
        setReorderMode: mockSetReorderMode,
        flipCard: vi.fn(),
        unflipCards: vi.fn(),
        loadCards: vi.fn(),
        addCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        clearAllCards: vi.fn(),
        reorderCards: vi.fn(),
        setCards: vi.fn(),
        toggleReorderMode: vi.fn(),
        setSortKey: vi.fn(),
        setSortDirection: vi.fn(),
        setGroupBy: vi.fn(),
        toggleGroupCollapsed: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        resetView: vi.fn(),
      };

      return selector(state);
    });
  });

  it('должен инициализировать глобальный обработчик ошибок', () => {
    renderHook(() => useApp());

    expect(initGlobalErrorHandler).toHaveBeenCalledOnce();
  });

  it('должен установить обработчик ошибок модального окна', () => {
    renderHook(() => useApp());

    expect(setErrorModalHandler).toHaveBeenCalledOnce();
  });

  it('должен вернуть handleModalOpen', () => {
    const { result } = renderHook(() => useApp());

    expect(result.current.handleModalOpen).toBeDefined();
    expect(typeof result.current.handleModalOpen).toBe('function');
  });

  it('handleModalOpen должен вызывать setReorderMode с false', () => {
    const { result } = renderHook(() => useApp());

    result.current.handleModalOpen();

    expect(mockSetReorderMode).toHaveBeenCalledWith(false);
  });

  it('handleModalOpen должен быть стабильной функцией', () => {
    const { result, rerender } = renderHook(() => useApp());

    const firstHandler = result.current.handleModalOpen;
    rerender();
    const secondHandler = result.current.handleModalOpen;

    expect(firstHandler).toBe(secondHandler);
  });
});
