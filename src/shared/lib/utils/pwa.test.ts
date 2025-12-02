import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkForServiceWorkerUpdate } from './pwa';

describe('checkForServiceWorkerUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен вызывать registration.update когда нет установки и есть интернет', async () => {
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

    await checkForServiceWorkerUpdate(mockRegistration);

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('не должен вызывать registration.update когда registration.installing = true', async () => {
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

    await checkForServiceWorkerUpdate(mockRegistration);

    expect(mockUpdate).not.toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('не должен вызывать registration.update когда navigator.onLine = false', async () => {
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

    await checkForServiceWorkerUpdate(mockRegistration);

    expect(mockUpdate).not.toHaveBeenCalled();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });

  it('должен обрабатывать ошибки при вызове registration.update', async () => {
    const mockConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Update failed');
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

    await checkForServiceWorkerUpdate(mockRegistration);

    expect(mockUpdate).toHaveBeenCalledTimes(1);
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
