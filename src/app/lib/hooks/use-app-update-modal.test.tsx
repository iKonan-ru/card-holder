import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAppUpdateModal } from './use-app-update-modal';

const mockUpdateServiceWorker = vi.fn(() => Promise.resolve());
const mockOpen = vi.fn();
const mockClose = vi.fn();

const mockUsePWAUpdate = vi.fn();
const mockUseModal = vi.fn();

vi.mock('@shared/lib', () => ({
  usePWAUpdate: () => mockUsePWAUpdate(),
  useModal: () => mockUseModal(),
}));

vi.mock('@shared/ui', () => ({
  UpdateModal: vi.fn(
    ({
      onUpdate,
      onDismiss,
    }: {
      onUpdate: () => void;
      onDismiss: () => void;
    }) => (
      <div data-testid="update-modal">
        <button onClick={onUpdate}>Update</button>
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    )
  ),
  UPDATE_MODAL_TITLE_ID: 'update-modal-title',
  UPDATE_MODAL_MESSAGE_ID: 'update-modal-message',
}));

describe('useAppUpdateModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: false,
      updateServiceWorker: mockUpdateServiceWorker,
    });
    mockUseModal.mockReturnValue({
      open: mockOpen,
      close: mockClose,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен рендериться без ошибок', () => {
    renderHook(() => useAppUpdateModal());

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('не должен открывать модальное окно когда needRefresh = false', () => {
    renderHook(() => useAppUpdateModal());

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('должен открывать модальное окно когда needRefresh = true', async () => {
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    renderHook(() => useAppUpdateModal());

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });
  });

  it('должен открывать модальное окно только один раз при needRefresh = true', async () => {
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { rerender } = renderHook(() => useAppUpdateModal());

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    rerender();

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  it('должен вызывать updateServiceWorker при обновлении', async () => {
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    renderHook(() => useAppUpdateModal());

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });

    const modalContent = mockOpen.mock.calls[0][0];
    const { render } = await import('@testing-library/react');
    const { userEvent } = await import('@testing-library/user-event');

    const { container } = render(modalContent);
    const updateButton = container.querySelector('button');

    if (updateButton) {
      const user = userEvent.setup();
      await user.click(updateButton);
      expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
    }
  });

  it('должен закрывать модальное окно при отклонении', async () => {
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    renderHook(() => useAppUpdateModal());

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });

    const modalContent = mockOpen.mock.calls[0][0];
    const { render } = await import('@testing-library/react');
    const { userEvent } = await import('@testing-library/user-event');

    const { container } = render(modalContent);
    const buttons = container.querySelectorAll('button');
    const dismissButton = buttons[1];

    if (dismissButton) {
      const user = userEvent.setup();
      await user.click(dismissButton);
      expect(mockClose).toHaveBeenCalled();
    }
  });

  it('должен сбрасывать флаг wasOpenedRef когда needRefresh становится false', async () => {
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { rerender } = renderHook(() => useAppUpdateModal());

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    mockUsePWAUpdate.mockReturnValue({
      needRefresh: false,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    mockOpen.mockClear();

    rerender();

    await waitFor(() => {
      expect(mockOpen).not.toHaveBeenCalled();
    });

    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    rerender();

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });
});
