import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkForServiceWorkerUpdate,
  checkHasNavigatorStandalone,
  checkIsBeforeInstallPromptEvent,
} from './pwa';

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
      testError,
    );

    mockConsoleError.mockRestore();

    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine);
    }
  });
});

describe('checkIsBeforeInstallPromptEvent', () => {
  it('должна возвращать true если событие содержит prompt и userChoice', () => {
    const event = Object.assign(new Event('beforeinstallprompt'), {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });

    expect(checkIsBeforeInstallPromptEvent(event)).toBe(true);
  });

  it('должна возвращать false если событие не содержит prompt', () => {
    const event = Object.assign(new Event('test'), {
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });

    expect(checkIsBeforeInstallPromptEvent(event)).toBe(false);
  });

  it('должна возвращать false если событие не содержит userChoice', () => {
    const event = Object.assign(new Event('test'), {
      prompt: vi.fn(),
    });

    expect(checkIsBeforeInstallPromptEvent(event)).toBe(false);
  });

  it('должна возвращать false для обычного события без дополнительных свойств', () => {
    const event = new Event('click');

    expect(checkIsBeforeInstallPromptEvent(event)).toBe(false);
  });
});

describe('checkHasNavigatorStandalone', () => {
  it('должна возвращать true если navigator содержит свойство standalone = true', () => {
    const nav = { standalone: true } as unknown as Navigator;

    expect(checkHasNavigatorStandalone(nav)).toBe(true);
  });

  it('должна возвращать true если navigator содержит свойство standalone = false', () => {
    const nav = { standalone: false } as unknown as Navigator;

    expect(checkHasNavigatorStandalone(nav)).toBe(true);
  });

  it('должна возвращать false если navigator не содержит свойство standalone', () => {
    const nav = {} as Navigator;

    expect(checkHasNavigatorStandalone(nav)).toBe(false);
  });
});
