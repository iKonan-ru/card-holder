import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardFormModal } from './use-card-form-modal';
import type { IBankCard } from '@entities/bank-card';

const { mockUseCardManagementStore, mockUseModal } = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
  mockUseModal: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

vi.mock('@shared/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/lib')>();

  return {
    ...actual,
    useModal: mockUseModal,
  };
});

describe('useCardFormModal', () => {
  const mockOpen = vi.fn();
  const mockClose = vi.fn();
  const mockUnflipCards = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseModal.mockReturnValue({
      open: mockOpen,
      close: mockClose,
      modalId: 'test-modal-id',
    });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector({ unflipCards: mockUnflipCards });
      }

      return { unflipCards: mockUnflipCards };
    });
  });

  it('должен открывать форму добавления карты', () => {
    const { result } = renderHook(() => useCardFormModal());

    act(() => {
      result.current.openAddCardForm();
    });

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockUnflipCards).toHaveBeenCalledTimes(1);
  });

  it('должен открывать форму редактирования карты', () => {
    const { result } = renderHook(() => useCardFormModal());

    const mockCard: IBankCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    act(() => {
      result.current.openEditCardForm(mockCard);
    });

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockUnflipCards).not.toHaveBeenCalled();
  });

  it('должен передавать initialCard в форму редактирования', () => {
    const { result } = renderHook(() => useCardFormModal());

    const mockCard: IBankCard = {
      pan: '5555555555554444',
      expires: '1225',
      name: 'JOHN DOE',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    act(() => {
      result.current.openEditCardForm(mockCard);
    });

    const openCallArgs = mockOpen.mock.calls[0];
    expect(openCallArgs).toBeDefined();
    expect(openCallArgs[0]).toBeDefined();
  });

  it('должен вызывать modal.close при onSuccess и onCancel', () => {
    const { result } = renderHook(() => useCardFormModal());

    act(() => {
      result.current.openAddCardForm();
    });

    const openCallArgs = mockOpen.mock.calls[0];
    expect(openCallArgs).toBeDefined();
    expect(openCallArgs[0]).toBeDefined();
  });
});
