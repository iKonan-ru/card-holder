import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useModalBackHandler } from './use-modal-back-handler';

describe('useModalBackHandler', () => {
  let mockPushState: ReturnType<typeof vi.fn>;
  let mockBack: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPushState = vi.fn();
    mockBack = vi.fn();

    Object.defineProperty(window, 'history', {
      value: {
        pushState: mockPushState,
        back: mockBack,
      },
      writable: true,
      configurable: true,
    });

    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен добавлять запись в историю при открытии модалки', () => {
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler({ isOpen: true, onClose }));

    expect(mockPushState).toHaveBeenCalledWith({ modal: true }, '');
  });

  it('должен добавлять popstate listener при открытии модалки', () => {
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler({ isOpen: true, onClose }));

    expect(window.addEventListener).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function),
    );
  });

  it('должен удалять popstate listener при размонтировании', () => {
    const onClose = vi.fn();

    const { unmount } = renderHook(() =>
      useModalBackHandler({ isOpen: true, onClose }),
    );

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function),
    );
  });

  it('должен вызывать onClose при событии popstate', () => {
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler({ isOpen: true, onClose }));

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'popstate',
      )?.[1] as EventListener;
      handler?.(new PopStateEvent('popstate'));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('должен откатывать историю при закрытии модалки', () => {
    const onClose = vi.fn();

    const { rerender } = renderHook((props) => useModalBackHandler(props), {
      initialProps: { isOpen: true, onClose },
    });

    rerender({ isOpen: false, onClose });

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('не должен добавлять запись в историю если модалка закрыта', () => {
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler({ isOpen: false, onClose }));

    expect(mockPushState).not.toHaveBeenCalled();
  });

  it('не должен добавлять listener если модалка закрыта', () => {
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler({ isOpen: false, onClose }));

    expect(window.addEventListener).not.toHaveBeenCalledWith(
      'popstate',
      expect.any(Function),
    );
  });

  it('должен корректно обрабатывать переоткрытие модалки', () => {
    const onClose = vi.fn();

    const { rerender, unmount } = renderHook(
      (props) => useModalBackHandler(props),
      {
        initialProps: { isOpen: true, onClose },
      },
    );

    expect(mockPushState).toHaveBeenCalledTimes(1);

    rerender({ isOpen: false, onClose });
    rerender({ isOpen: true, onClose });

    expect(mockPushState).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('должен вызывать новый onClose при его изменении', () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();

    const { rerender } = renderHook((props) => useModalBackHandler(props), {
      initialProps: { isOpen: true, onClose: onClose1 },
    });

    rerender({ isOpen: true, onClose: onClose2 });

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'popstate',
      )?.[1] as EventListener;
      handler?.(new PopStateEvent('popstate'));
    });

    expect(onClose1).not.toHaveBeenCalled();
    expect(onClose2).toHaveBeenCalledTimes(1);
  });

  it('не должен вызывать onClose при popstate если isHistoryPushedRef.current false', () => {
    const onClose = vi.fn();

    const { rerender } = renderHook((props) => useModalBackHandler(props), {
      initialProps: { isOpen: false, onClose },
    });

    rerender({ isOpen: true, onClose });

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'popstate',
      )?.[1] as EventListener;
      handler?.(new PopStateEvent('popstate'));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('не должен откатывать историю если модалка была закрыта через popstate', () => {
    const onClose = vi.fn();

    const { rerender } = renderHook((props) => useModalBackHandler(props), {
      initialProps: { isOpen: true, onClose },
    });

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'popstate',
      )?.[1] as EventListener;
      handler?.(new PopStateEvent('popstate'));
    });

    mockBack.mockClear();

    rerender({ isOpen: false, onClose });

    expect(mockBack).not.toHaveBeenCalled();
  });

  it('не должен добавлять запись в историю если isHistoryPushedRef.current уже true', () => {
    const onClose = vi.fn();

    const { rerender } = renderHook((props) => useModalBackHandler(props), {
      initialProps: { isOpen: true, onClose },
    });

    expect(mockPushState).toHaveBeenCalledTimes(1);

    mockPushState.mockClear();

    rerender({ isOpen: true, onClose });

    expect(mockPushState).not.toHaveBeenCalled();
  });

  it('должен сбрасывать closedByPopStateRef при открытии модалки', () => {
    const onClose = vi.fn();

    const { rerender } = renderHook((props) => useModalBackHandler(props), {
      initialProps: { isOpen: true, onClose },
    });

    act(() => {
      const addEventListenerMock = vi.mocked(window.addEventListener);
      const handler = addEventListenerMock.mock.calls.find(
        (call) => call[0] === 'popstate',
      )?.[1] as EventListener;
      handler?.(new PopStateEvent('popstate'));
    });

    mockBack.mockClear();

    rerender({ isOpen: false, onClose });
    rerender({ isOpen: true, onClose });

    expect(mockPushState).toHaveBeenCalled();
  });
});
