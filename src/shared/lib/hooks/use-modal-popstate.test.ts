import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Procedure } from '@shared/types';
import type { IModalItem } from '../context';
import { useModalPopstate } from './use-modal-popstate';

const mockCloseTop = vi.fn();
const mockIsClosingFromHistoryRef = { current: false };
const mockModalRequestCloseRef = { current: new Map<string, Procedure>() };

const createMockModal = (id: string): IModalItem => ({
  id,
  content: `Modal ${id}`,
});

describe('useModalPopstate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsClosingFromHistoryRef.current = false;
    mockModalRequestCloseRef.current.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен рендериться без ошибок', () => {
    renderHook(() =>
      useModalPopstate({
        modals: [],
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        isClosingFromHistoryRef: mockIsClosingFromHistoryRef,
      }),
    );

    expect(mockCloseTop).not.toHaveBeenCalled();
  });

  it('должен закрывать верхнее модальное окно при popstate', () => {
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalPopstate({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        isClosingFromHistoryRef: mockIsClosingFromHistoryRef,
      }),
    );

    const event = new PopStateEvent('popstate');
    window.dispatchEvent(event);

    expect(mockCloseTop).toHaveBeenCalledTimes(1);
    expect(mockIsClosingFromHistoryRef.current).toBe(true);
  });

  it('должен вызывать requestClose если он установлен', () => {
    const requestClose = vi.fn();
    mockModalRequestCloseRef.current.set('modal-1', requestClose);
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalPopstate({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        isClosingFromHistoryRef: mockIsClosingFromHistoryRef,
      }),
    );

    const event = new PopStateEvent('popstate');
    window.dispatchEvent(event);

    expect(requestClose).toHaveBeenCalledTimes(1);
    expect(mockIsClosingFromHistoryRef.current).toBe(true);
    expect(mockCloseTop).not.toHaveBeenCalled();
  });

  it('не должен обрабатывать popstate если нет модальных окон', () => {
    renderHook(() =>
      useModalPopstate({
        modals: [],
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        isClosingFromHistoryRef: mockIsClosingFromHistoryRef,
      }),
    );

    const event = new PopStateEvent('popstate');
    window.dispatchEvent(event);

    expect(mockCloseTop).not.toHaveBeenCalled();
  });

  it('должен обрабатывать несколько модальных окон и закрывать верхнее', () => {
    const modals = [createMockModal('modal-1'), createMockModal('modal-2')];

    renderHook(() =>
      useModalPopstate({
        modals,
        closeTop: mockCloseTop,
        modalRequestCloseRef: mockModalRequestCloseRef,
        isClosingFromHistoryRef: mockIsClosingFromHistoryRef,
      }),
    );

    const event = new PopStateEvent('popstate');
    window.dispatchEvent(event);

    expect(mockCloseTop).toHaveBeenCalledTimes(1);
    expect(mockIsClosingFromHistoryRef.current).toBe(true);
  });
});
