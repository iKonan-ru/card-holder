import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTIVITY_EVENTS, INACTIVITY_TIMEOUT_MS } from '../constants';
import { useInactivityLock } from './use-inactivity-lock';

const mockLock = vi.fn();

const { mockUseCryptoStore } = vi.hoisted(() => ({
  mockUseCryptoStore: vi.fn(),
}));

vi.mock('../store', () => ({
  useCryptoStore: mockUseCryptoStore,
}));

describe('useInactivityLock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockLock.mockClear();
    mockUseCryptoStore.mockImplementation((selector) => {
      if (selector) {
        return selector({ lock: mockLock });
      }

      return { lock: mockLock };
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('должен добавить обработчики для всех событий активности', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');

    renderHook(() => useInactivityLock());

    for (const event of ACTIVITY_EVENTS) {
      expect(addSpy).toHaveBeenCalledWith(event, expect.any(Function));
    }
  });

  it('должен вызвать lock по истечении таймаута бездействия', () => {
    renderHook(() => useInactivityLock());

    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);

    expect(mockLock).toHaveBeenCalledTimes(1);
  });

  it('не должен вызвать lock раньше таймаута', () => {
    renderHook(() => useInactivityLock());

    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS - 1);

    expect(mockLock).not.toHaveBeenCalled();
  });

  it('должен сбросить таймер при событии mousemove', () => {
    renderHook(() => useInactivityLock());

    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS - 1000);
    document.dispatchEvent(new Event('mousemove'));
    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS - 1000);

    expect(mockLock).not.toHaveBeenCalled();
  });

  it('должен вызвать lock после нового таймаута по сбросу', () => {
    renderHook(() => useInactivityLock());

    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS - 1000);
    document.dispatchEvent(new Event('keydown'));
    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);

    expect(mockLock).toHaveBeenCalledTimes(1);
  });

  it('должен сбросить таймер при всех зарегистрированных событиях', () => {
    renderHook(() => useInactivityLock());

    for (const event of ACTIVITY_EVENTS) {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS - 1000);
      document.dispatchEvent(new Event(event));
    }

    expect(mockLock).not.toHaveBeenCalled();
  });

  it('должен снять обработчики при анмаунте', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useInactivityLock());

    unmount();

    for (const event of ACTIVITY_EVENTS) {
      expect(removeSpy).toHaveBeenCalledWith(event, expect.any(Function));
    }
  });

  it('должен очистить таймер при анмаунте', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = renderHook(() => useInactivityLock());

    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('не должен вызвать lock после анмаунта', () => {
    const { unmount } = renderHook(() => useInactivityLock());

    unmount();
    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS * 2);

    expect(mockLock).not.toHaveBeenCalled();
  });
});
