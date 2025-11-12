import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useClearData } from './use-clear-data';
import * as modalContextModule from '@shared/lib/modal/use-modal-context';

vi.mock('@shared/lib/modal/use-modal-context');

describe('useClearData', () => {
  const mockOnClear = vi.fn();
  const mockOpenModal = vi.fn();
  const mockCloseModal = vi.fn();
  const mockUserActionRef = { current: false };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(modalContextModule.useModalContext).mockReturnValue({
      modals: [],
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      closeAllModals: vi.fn(),
      userActionRef: mockUserActionRef,
    });
  });

  it('должен возвращать isClearing как false изначально', () => {
    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    expect(result.current.isClearing).toBe(false);
  });

  it('должен возвращать функцию clearData', () => {
    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    expect(typeof result.current.clearData).toBe('function');
  });

  it('должен открывать модальное окно при вызове clearData', () => {
    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    expect(mockOpenModal).toHaveBeenCalledOnce();
    expect(mockOpenModal).toHaveBeenCalledWith(
      'confirm-clear-all',
      expect.anything(),
      'confirm-clear-all-title',
      'confirm-clear-all-message'
    );
  });

  it('должен передавать ConfirmModal в openModal', () => {
    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    const modalContent = mockOpenModal.mock.calls[0][1];

    expect(modalContent).toBeDefined();
  });

  it('должен сбрасывать isClearing после завершения очистки', async () => {
    mockOnClear.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    const modalContent = mockOpenModal.mock.calls[0][1];

    expect(result.current.isClearing).toBe(false);

    await act(async () => {
      await modalContent.props.onConfirm();
    });

    expect(result.current.isClearing).toBe(false);
  });

  it('должен вызывать onClear при подтверждении', async () => {
    mockOnClear.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    const modalContent = mockOpenModal.mock.calls[0][1];

    await act(async () => {
      await modalContent.props.onConfirm();
    });

    expect(mockOnClear).toHaveBeenCalledOnce();
  });

  it('должен закрывать модальное окно после успешной очистки', async () => {
    mockOnClear.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    const modalContent = mockOpenModal.mock.calls[0][1];

    await act(async () => {
      await modalContent.props.onConfirm();
    });

    expect(mockCloseModal).toHaveBeenCalledWith('confirm-clear-all');
  });

  it('должен обрабатывать ошибки при очистке', async () => {
    const testError = new Error('Test error');

    mockOnClear.mockRejectedValue(testError);

    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    const modalContent = mockOpenModal.mock.calls[0][1];

    await act(async () => {
      try {
        await modalContent.props.onConfirm();
      } catch {
        // ignore
      }
    });

    await waitFor(() => {
      expect(result.current.isClearing).toBe(false);
    });

    expect(mockOnClear).toHaveBeenCalledOnce();
  });

  it('должен работать с множественными вызовами clearData', () => {
    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.clearData();
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(2);
  });

  it('не должен вызывать onClear без подтверждения', () => {
    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    expect(mockOnClear).not.toHaveBeenCalled();
  });

  it('должен использовать правильные константы для модального окна', () => {
    const { result } = renderHook(() => useClearData({ onClear: mockOnClear }));

    act(() => {
      result.current.clearData();
    });

    const [modalId, , titleId, messageId] = mockOpenModal.mock.calls[0];

    expect(modalId).toBe('confirm-clear-all');
    expect(titleId).toBe('confirm-clear-all-title');
    expect(messageId).toBe('confirm-clear-all-message');
  });
});
