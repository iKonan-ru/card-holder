import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePWAUpdate } from './use-pwa-update';

interface IRegisterSWConfig {
  onRegisteredSW?: (
    url: string,
    registration: ServiceWorkerRegistration | undefined
  ) => void;
  onRegisterError?: (error: Error) => void;
}

interface IRegisterSWReturn {
  needRefresh: [boolean, (value: boolean) => void];
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

const mockUpdateServiceWorker = vi.fn(() => Promise.resolve()) as unknown as (
  reloadPage?: boolean
) => Promise<void>;
const mockUseRegisterSW = vi.fn();

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: (config?: IRegisterSWConfig) =>
    mockUseRegisterSW(config) as IRegisterSWReturn,
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
    expect(result.current).toEqual({
      needRefresh: false,
      updateServiceWorker: mockUpdateServiceWorker,
    });
  });

  it('должен возвращать needRefresh = true когда доступно обновление', () => {
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [true, vi.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { result } = renderHook(() => usePWAUpdate());
    expect(result.current.needRefresh).toBe(true);
    expect(result.current.updateServiceWorker).toBeDefined();
  });

  it('должен возвращать needRefresh = false когда обновление недоступно', () => {
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [false, vi.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { result } = renderHook(() => usePWAUpdate());
    expect(result.current.needRefresh).toBe(false);
    expect(result.current.updateServiceWorker).toBeDefined();
  });

  it('должен регистрировать service worker через onRegisteredSW', async () => {
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

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(1000);

    expect(mockUpdate).toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('должен вызывать console.error при ошибке регистрации', () => {
    const mockConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Test error');

    let capturedOnRegisterError:
      | IRegisterSWConfig['onRegisterError']
      | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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
    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

  it('должен обновлять needRefresh при смене с false на true', () => {
    const { rerender, result } = renderHook(
      ({ needRefresh }) => {
        mockUseRegisterSW.mockReturnValue({
          needRefresh: [needRefresh, vi.fn()],
          updateServiceWorker: mockUpdateServiceWorker,
        });

        return usePWAUpdate();
      },
      {
        initialProps: { needRefresh: false },
      }
    );

    expect(result.current.needRefresh).toBe(false);

    rerender({ needRefresh: true });

    expect(result.current.needRefresh).toBe(true);
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

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(1000);

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    mockUpdate.mockClear();

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

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

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

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

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

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

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

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

  it('должен проверять обновления при событии focus', async () => {
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

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(1000);

    mockUpdate.mockClear();

    window.dispatchEvent(new Event('focus'));

    await vi.advanceTimersByTimeAsync(100);

    expect(mockUpdate).toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('должен проверять обновления при изменении видимости страницы', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRegistration = {
      installing: false,
      update: mockUpdate,
    } as unknown as ServiceWorkerRegistration;

    const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine');
    const originalVisibilityState = Object.getOwnPropertyDescriptor(
      document,
      'visibilityState'
    );

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'visible',
    });

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(1000);

    mockUpdate.mockClear();

    document.dispatchEvent(new Event('visibilitychange'));

    await vi.advanceTimersByTimeAsync(100);

    expect(mockUpdate).toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }

    if (originalVisibilityState) {
      Object.defineProperty(
        document,
        'visibilityState',
        originalVisibilityState
      );
    }
  });

  it('не должен проверять обновления при изменении видимости если страница скрыта', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRegistration = {
      installing: false,
      update: mockUpdate,
    } as unknown as ServiceWorkerRegistration;

    const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine');
    const originalVisibilityState = Object.getOwnPropertyDescriptor(
      document,
      'visibilityState'
    );

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'hidden',
    });

    let capturedOnRegisteredSW: IRegisterSWConfig['onRegisteredSW'] | undefined;

    mockUseRegisterSW.mockImplementation(
      (config?: IRegisterSWConfig): IRegisterSWReturn => {
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

    await vi.advanceTimersByTimeAsync(1000);

    mockUpdate.mockClear();

    document.dispatchEvent(new Event('visibilitychange'));

    await vi.advanceTimersByTimeAsync(100);

    expect(mockUpdate).not.toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }

    if (originalVisibilityState) {
      Object.defineProperty(
        document,
        'visibilityState',
        originalVisibilityState
      );
    }
  });
});
