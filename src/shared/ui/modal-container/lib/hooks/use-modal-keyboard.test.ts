import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useModalKeyboard } from './use-modal-keyboard';
import { ESC_KEY } from '../constants';
import type { IModalItem } from '@shared/lib';

const mockCloseTop = vi.fn();
const mockUserActionRef = { current: false };
const mockModalRequestCloseRef = { current: new Map<string, () => void>() };

const createMockModal = (id: string, preventClose = false): IModalItem => ({
  id,
  content: `Modal ${id}`,
  preventClose,
});

describe('useModalKeyboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
    mockUserActionRef.current = false;
    mockModalRequestCloseRef.current.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('должен рендериться без ошибок', () => {
    renderHook(() =>
      useModalKeyboard({
        modals: [],
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        userActionRef: mockUserActionRef,
      })
    );

    expect(mockCloseTop).not.toHaveBeenCalled();
  });

  it('должен закрывать верхнее модальное окно при нажатии Escape', () => {
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalKeyboard({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        userActionRef: mockUserActionRef,
      })
    );

    const event = new KeyboardEvent('keydown', { key: ESC_KEY });
    window.dispatchEvent(event);

    expect(mockCloseTop).toHaveBeenCalledTimes(1);
    expect(mockUserActionRef.current).toBe(true);
  });

  it('не должен закрывать модальное окно если preventClose = true', () => {
    const modals = [createMockModal('modal-1', true)];

    renderHook(() =>
      useModalKeyboard({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        userActionRef: mockUserActionRef,
      })
    );

    const event = new KeyboardEvent('keydown', { key: ESC_KEY });
    window.dispatchEvent(event);

    expect(mockCloseTop).not.toHaveBeenCalled();
  });

  it('должен вызывать requestClose если он установлен', () => {
    const requestClose = vi.fn();
    mockModalRequestCloseRef.current.set('modal-1', requestClose);
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalKeyboard({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        userActionRef: mockUserActionRef,
      })
    );

    const event = new KeyboardEvent('keydown', { key: ESC_KEY });
    window.dispatchEvent(event);

    expect(requestClose).toHaveBeenCalledTimes(1);
    expect(mockUserActionRef.current).toBe(true);
    expect(mockCloseTop).not.toHaveBeenCalled();
  });

  it('не должен обрабатывать другие клавиши', () => {
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalKeyboard({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        userActionRef: mockUserActionRef,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(mockCloseTop).not.toHaveBeenCalled();
  });

  it('должен блокировать прокрутку body когда есть модальные окна', () => {
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalKeyboard({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        userActionRef: mockUserActionRef,
      })
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('должен разблокировать прокрутку body когда модальные окна закрыты', () => {
    const { rerender } = renderHook(
      ({ modals }) =>
        useModalKeyboard({
          modals,
          closeTop: mockCloseTop,
          modalRequestCloseRef: mockModalRequestCloseRef,
          userActionRef: mockUserActionRef,
        }),
      {
        initialProps: { modals: [createMockModal('modal-1')] },
      }
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender({ modals: [] });

    expect(document.body.style.overflow).toBe('');
  });

  it('должен обрабатывать несколько модальных окон и закрывать верхнее', () => {
    const modals = [createMockModal('modal-1'), createMockModal('modal-2')];

    renderHook(() =>
      useModalKeyboard({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        userActionRef: mockUserActionRef,
      })
    );

    const event = new KeyboardEvent('keydown', { key: ESC_KEY });
    window.dispatchEvent(event);

    expect(mockCloseTop).toHaveBeenCalledTimes(1);
  });
});
