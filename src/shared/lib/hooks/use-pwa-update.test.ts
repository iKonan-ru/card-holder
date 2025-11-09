import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePWAUpdate } from './use-pwa-update';

interface RegisterSWConfig {
  onRegisteredSW?: (
    url: string,
    registration: ServiceWorkerRegistration | undefined
  ) => void;
  onRegisterError?: (error: Error) => void;
}

interface RegisterSWReturn {
  needRefresh: [boolean, (value: boolean) => void];
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

const mockUpdateServiceWorker = vi.fn(() => Promise.resolve()) as unknown as (
  reloadPage?: boolean
) => Promise<void>;
const mockUseRegisterSW = vi.fn();

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: (config?: RegisterSWConfig) =>
    mockUseRegisterSW(config) as RegisterSWReturn,
}));

describe('usePWAUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('должен рендериться без ошибок', () => {
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [false, vi.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { result } = renderHook(() => usePWAUpdate());
    expect(result.current).toBeUndefined();
  });

  it('должен вызывать updateServiceWorker когда needRefresh = true', () => {
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [true, vi.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    renderHook(() => usePWAUpdate());

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('не должен вызывать updateServiceWorker когда needRefresh = false', () => {
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [false, vi.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    renderHook(() => usePWAUpdate());

    expect(mockUpdateServiceWorker).not.toHaveBeenCalled();
  });

  it('должен регистрировать service worker через onRegisteredSW', () => {
    const mockRegistration = {
      installing: false,
      update: vi.fn().mockResolvedValue(undefined),
    } as unknown as ServiceWorkerRegistration;

    let capturedOnRegisteredSW: RegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: RegisterSWConfig): RegisterSWReturn => {
        if (config?.onRegisteredSW) {
          capturedOnRegisteredSW = config.onRegisteredSW;
        }

        return {
          needRefresh: [false, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        };
      }
    );

    renderHook(() => usePWAUpdate());

    expect(capturedOnRegisteredSW).toBeDefined();

    if (capturedOnRegisteredSW) {
      capturedOnRegisteredSW('/sw.js', mockRegistration);
    }

    expect(mockRegistration.update).not.toHaveBeenCalled();
  });

  it('должен вызывать console.error при ошибке регистрации', () => {
    const mockConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Test error');

    let capturedOnRegisterError:
      | RegisterSWConfig['onRegisterError']
      | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: RegisterSWConfig): RegisterSWReturn => {
        if (config?.onRegisterError) {
          capturedOnRegisterError = config.onRegisterError;
        }

        return {
          needRefresh: [false, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        };
      }
    );

    renderHook(() => usePWAUpdate());

    expect(capturedOnRegisterError).toBeDefined();

    if (capturedOnRegisterError) {
      capturedOnRegisterError(testError);
    }

    expect(mockConsoleError).toHaveBeenCalledWith(
      'SW registration error',
      testError
    );
    mockConsoleError.mockRestore();
  });

  it('не должен запускать проверку обновлений если registration отсутствует', () => {
    let capturedOnRegisteredSW: RegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: RegisterSWConfig): RegisterSWReturn => {
        if (config?.onRegisteredSW) {
          capturedOnRegisteredSW = config.onRegisteredSW;
        }

        return {
          needRefresh: [false, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        };
      }
    );

    renderHook(() => usePWAUpdate());

    if (capturedOnRegisteredSW) {
      capturedOnRegisteredSW('/sw.js', undefined);
    }

    expect(capturedOnRegisteredSW).toBeDefined();
  });

  it('должен вызывать update при смене needRefresh с false на true', () => {
    const { rerender } = renderHook(
      ({ needRefresh }) => {
        mockUseRegisterSW.mockReturnValue({
          needRefresh: [needRefresh, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        });
        usePWAUpdate();
      },
      {
        initialProps: { needRefresh: false },
      }
    );

    expect(mockUpdateServiceWorker).not.toHaveBeenCalled();

    rerender({ needRefresh: true });

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('должен периодически проверять обновления через setInterval', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRegistration = {
      installing: false,
      update: mockUpdate,
    } as unknown as ServiceWorkerRegistration;

    const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine');

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    let capturedOnRegisteredSW: RegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: RegisterSWConfig): RegisterSWReturn => {
        if (config?.onRegisteredSW) {
          capturedOnRegisteredSW = config.onRegisteredSW;
        }

        return {
          needRefresh: [false, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        };
      }
    );

    renderHook(() => usePWAUpdate());

    if (capturedOnRegisteredSW) {
      capturedOnRegisteredSW('/sw.js', mockRegistration);
    }

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    expect(mockUpdate).toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('не должен проверять обновления если registration.installing = true', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRegistration = {
      installing: true,
      update: mockUpdate,
    } as unknown as ServiceWorkerRegistration;

    const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine');

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    let capturedOnRegisteredSW: RegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: RegisterSWConfig): RegisterSWReturn => {
        if (config?.onRegisteredSW) {
          capturedOnRegisteredSW = config.onRegisteredSW;
        }

        return {
          needRefresh: [false, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        };
      }
    );

    renderHook(() => usePWAUpdate());

    if (capturedOnRegisteredSW) {
      capturedOnRegisteredSW('/sw.js', mockRegistration);
    }

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    expect(mockUpdate).not.toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('не должен проверять обновления если navigator.onLine = false', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRegistration = {
      installing: false,
      update: mockUpdate,
    } as unknown as ServiceWorkerRegistration;

    const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine');

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    let capturedOnRegisteredSW: RegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: RegisterSWConfig): RegisterSWReturn => {
        if (config?.onRegisteredSW) {
          capturedOnRegisteredSW = config.onRegisteredSW;
        }

        return {
          needRefresh: [false, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        };
      }
    );

    renderHook(() => usePWAUpdate());

    if (capturedOnRegisteredSW) {
      capturedOnRegisteredSW('/sw.js', mockRegistration);
    }

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    expect(mockUpdate).not.toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('должен обрабатывать ошибки при проверке обновлений', async () => {
    const mockConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Update check failed');
    const mockUpdate = vi.fn().mockRejectedValue(testError);
    const mockRegistration = {
      installing: false,
      update: mockUpdate,
    } as unknown as ServiceWorkerRegistration;

    const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine');

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    let capturedOnRegisteredSW: RegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: RegisterSWConfig): RegisterSWReturn => {
        if (config?.onRegisteredSW) {
          capturedOnRegisteredSW = config.onRegisteredSW;
        }

        return {
          needRefresh: [false, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        };
      }
    );

    renderHook(() => usePWAUpdate());

    if (capturedOnRegisteredSW) {
      capturedOnRegisteredSW('/sw.js', mockRegistration);
    }

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockConsoleError).toHaveBeenCalledWith(
      'SW update check error',
      testError
    );

    mockConsoleError.mockRestore();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });
});
