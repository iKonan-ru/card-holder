import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnimatedModalClose } from './use-animated-modal-close';

const mockCloseModal = vi.fn();

vi.mock('./modal-close-context', () => ({
  useModalClose: () => mockCloseModal,
}));

describe('useAnimatedModalClose', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен возвращать функцию закрытия', () => {
    const { result } = renderHook(() => useAnimatedModalClose());

    expect(typeof result.current).toBe('function');
  });

  it('должен вызывать closeModal при вызове', () => {
    const { result } = renderHook(() => useAnimatedModalClose());

    result.current();

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать callback если он передан', () => {
    const mockCallback = vi.fn();

    const { result } = renderHook(() => useAnimatedModalClose(mockCallback));

    result.current();

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('не должен вызывать callback если он не передан', () => {
    const { result } = renderHook(() => useAnimatedModalClose());

    result.current();

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('должен мемоизировать функцию', () => {
    const { result, rerender } = renderHook(() => useAnimatedModalClose());

    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it('должен обновлять функцию при изменении callback', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ callback }) => useAnimatedModalClose(callback),
      {
        initialProps: { callback: mockCallback1 },
      }
    );

    const firstResult = result.current;

    rerender({ callback: mockCallback2 });

    expect(result.current).not.toBe(firstResult);
  });
});
