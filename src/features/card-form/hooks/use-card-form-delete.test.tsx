import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DELETE_MODAL_TITLE } from '../constants';
import { useCardFormDelete } from './use-card-form-delete';

const { mockUseModal } = vi.hoisted(() => ({
  mockUseModal: vi.fn(),
}));

vi.mock('@shared/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/lib')>();

  return {
    ...actual,
    useModal: mockUseModal,
  };
});

vi.mock('@features/app-lock', () => ({
  MasterPasswordConfirmModal: vi.fn(() => null),
}));

describe('useCardFormDelete', () => {
  const mockOpen = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseModal.mockReturnValue({
      open: mockOpen,
      close: vi.fn(),
      modalId: 'test-id',
    });
  });

  it('должен вызвать open при клике на удаление', () => {
    const { result } = renderHook(() =>
      useCardFormDelete({ onDelete: mockOnDelete }),
    );

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it('должен передать DELETE_MODAL_TITLE в open', () => {
    const { result } = renderHook(() =>
      useCardFormDelete({ onDelete: mockOnDelete }),
    );

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(mockOpen).toHaveBeenCalledWith(
      expect.anything(),
      DELETE_MODAL_TITLE,
    );
  });

  it('должен передавать JSX-контент как первый аргумент в open', () => {
    const { result } = renderHook(() =>
      useCardFormDelete({ onDelete: mockOnDelete }),
    );

    act(() => {
      result.current.handleDeleteClick();
    });

    const [content] = mockOpen.mock.calls[0];

    expect(content).toBeDefined();
  });
});
