import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePWAInstall } from './use-pwa-install';

const createMockBeforeInstallPromptEvent = (
  outcome: 'accepted' | 'dismissed' = 'accepted',
) => {
  const promptMock = vi.fn().mockResolvedValue(undefined);
  const userChoiceMock = Promise.resolve({ outcome });

  return {
    preventDefault: vi.fn(),
    prompt: promptMock,
    userChoice: userChoiceMock,
  };
};

describe('usePWAInstall', () => {
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
    vi.spyOn(window, 'matchMedia').mockImplementation(
      () =>
        ({
          matches: false,
          media: '(display-mode: standalone)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен инициализироваться с корректными значениями по умолчанию', () => {
    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.canInstall).toBe(false);
    expect(result.current.isInstalled).toBe(false);
    expect(typeof result.current.handleInstall).toBe('function');
  });

  it('должен добавлять event listeners при монтировании', () => {
    renderHook(() => usePWAInstall());

    expect(window.addEventListener).toHaveBeenCalledWith(
      'beforeinstallprompt',
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'appinstalled',
      expect.any(Function),
    );
  });

  it('должен удалять event listeners при размонтировании', () => {
    const { unmount } = renderHook(() => usePWAInstall());

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'beforeinstallprompt',
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'appinstalled',
      expect.any(Function),
    );
  });

  it('должен устанавливать canInstall в true при получении beforeinstallprompt события', async () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = createMockBeforeInstallPromptEvent();

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'beforeinstallprompt',
      )?.[1] as EventListener;
      handler?.(mockEvent as unknown as Event);
    });

    await waitFor(() => {
      expect(result.current.canInstall).toBe(true);
    });
  });

  it('должен устанавливать isInstalled в true при получении appinstalled события', async () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = createMockBeforeInstallPromptEvent();

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const beforeInstallHandler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'beforeinstallprompt',
      )?.[1] as EventListener;
      beforeInstallHandler?.(mockEvent as unknown as Event);
    });

    await waitFor(() => {
      expect(result.current.canInstall).toBe(true);
    });

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const appInstalledHandler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'appinstalled',
      )?.[1] as EventListener;
      appInstalledHandler?.(new Event('appinstalled'));
    });

    await waitFor(() => {
      expect(result.current.isInstalled).toBe(true);
      expect(result.current.canInstall).toBe(false);
    });
  });

  it('должен определять standalone режим через matchMedia', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      () =>
        ({
          matches: true,
          media: '(display-mode: standalone)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );

    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.isInstalled).toBe(true);
  });

  it('должен определять standalone режим через navigator.standalone', () => {
    const originalNavigator = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator, standalone: true },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.isInstalled).toBe(true);

    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('не должен вызывать prompt если deferredPrompt отсутствует', async () => {
    const { result } = renderHook(() => usePWAInstall());

    await act(async () => {
      await result.current.handleInstall();
    });

    expect(result.current.canInstall).toBe(false);
  });

  it('должен вызывать prompt при handleInstall и outcome accepted', async () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = createMockBeforeInstallPromptEvent('accepted');

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'beforeinstallprompt',
      )?.[1] as EventListener;
      handler?.(mockEvent as unknown as Event);
    });

    await waitFor(() => {
      expect(result.current.canInstall).toBe(true);
    });

    await act(async () => {
      await result.current.handleInstall();
    });

    await waitFor(() => {
      expect(mockEvent.prompt).toHaveBeenCalled();
      expect(result.current.canInstall).toBe(false);
    });
  });

  it('не должен сбрасывать deferredPrompt при outcome dismissed', async () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = createMockBeforeInstallPromptEvent('dismissed');

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'beforeinstallprompt',
      )?.[1] as EventListener;
      handler?.(mockEvent as unknown as Event);
    });

    await waitFor(() => {
      expect(result.current.canInstall).toBe(true);
    });

    await act(async () => {
      await result.current.handleInstall();
    });

    await waitFor(() => {
      expect(mockEvent.prompt).toHaveBeenCalled();
      expect(result.current.canInstall).toBe(true);
    });
  });

  it('не должен устанавливать deferredPrompt если событие не является BeforeInstallPromptEvent', () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = new Event('beforeinstallprompt');

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'beforeinstallprompt',
      )?.[1] as EventListener;
      handler?.(mockEvent);
    });

    expect(result.current.canInstall).toBe(false);
  });
});
