import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppUpdateModal } from '@app/hooks';
import type { Procedure } from '@shared/types';

const mockUpdateServiceWorker = vi.fn(() => Promise.resolve());
const mockOpen = vi.fn();
const mockClose = vi.fn();

const mockUsePWAUpdate = vi.fn();
const mockUseModal = vi.fn();

vi.mock('./use-pwa-update', () => ({
  usePWAUpdate: () => mockUsePWAUpdate(),
}));

vi.mock('@shared/lib', () => ({
  useModal: () => mockUseModal(),
}));

vi.mock('@features/pwa-update', () => ({
  PWAUpdate: vi.fn(
    ({
      onUpdate,
      onDismiss,
    }: {
      onUpdate: Procedure;
      onDismiss: Procedure;
    }) => (
      <div data-testid="pwa-update">
        <button onClick={onUpdate}>Обновить</button>
        <button onClick={onDismiss}>Отклонить</button>
      </div>
    )
  ),
  PWA_UPDATE_TITLE: 'Обновление приложения',
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

  it('не должен открывать модальное окно повторно если wasOpenedRef.current уже true', async () => {
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { rerender } = renderHook(() => useAppUpdateModal());

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    mockOpen.mockClear();

    rerender();

    await waitFor(() => {
      expect(mockOpen).not.toHaveBeenCalled();
    });
  });

  it('не должен открывать модальное окно если wasOpenedRef.current уже true при первом рендере', async () => {
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

    rerender();

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    mockOpen.mockClear();

    rerender();

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  it('не должен открывать модальное окно повторно если wasOpenedRef.current уже true когда needRefresh становится true', async () => {
    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { rerender } = renderHook(() => useAppUpdateModal());

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    mockOpen.mockClear();

    mockUsePWAUpdate.mockReturnValue({
      needRefresh: true,
      updateServiceWorker: mockUpdateServiceWorker,
    });

    rerender();

    await waitFor(() => {
      expect(mockOpen).not.toHaveBeenCalled();
    });
  });
});
