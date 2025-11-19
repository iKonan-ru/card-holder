import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { IModalItem } from '../context';
import { MODAL_STATE_KEY } from '../constants';
import { useModalHistory } from './use-modal-history';

const mockPush = vi.fn();
const mockRemove = vi.fn();
const mockCloseModal = vi.fn();
const mockUserActionRef = { current: false };
const mockModalRequestCloseRef = { current: new Map<string, () => void>() };

const createMockModal = (id: string): IModalItem => ({
  id,
  content: `Modal ${id}`,
});

describe('useModalHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState = vi.fn();
    window.history.back = vi.fn();
    mockUserActionRef.current = false;
    mockModalRequestCloseRef.current.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен рендериться без ошибок', () => {
    renderHook(() =>
      useModalHistory({
        modals: [],
        push: mockPush,
        remove: mockRemove,
        closeModal: mockCloseModal,
        userActionRef: mockUserActionRef,
        modalRequestCloseRef: mockModalRequestCloseRef,
      })
    );

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('должен добавлять модальное окно в историю при открытии', () => {
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalHistory({
        modals,
        push: mockPush,
        remove: mockRemove,
        closeModal: mockCloseModal,
        userActionRef: mockUserActionRef,
        modalRequestCloseRef: mockModalRequestCloseRef,
      })
    );

    expect(mockPush).toHaveBeenCalledWith('modal-1', expect.any(Function));
    expect(window.history.pushState).toHaveBeenCalledWith(
      { [MODAL_STATE_KEY]: true },
      ''
    );
  });

  it('должен удалять модальное окно из истории при закрытии', () => {
    const { rerender } = renderHook(
      ({ modals }) =>
        useModalHistory({
          modals,
          push: mockPush,
          remove: mockRemove,
          closeModal: mockCloseModal,
          userActionRef: mockUserActionRef,
          modalRequestCloseRef: mockModalRequestCloseRef,
        }),
      {
        initialProps: { modals: [createMockModal('modal-1')] },
      }
    );

    expect(mockPush).toHaveBeenCalledWith('modal-1', expect.any(Function));

    rerender({ modals: [] });

    expect(mockRemove).toHaveBeenCalledWith('modal-1');
  });

  it('должен вызывать window.history.back при закрытии модального окна', () => {
    const { rerender } = renderHook(
      ({ modals }) =>
        useModalHistory({
          modals,
          push: mockPush,
          remove: mockRemove,
          closeModal: mockCloseModal,
          userActionRef: mockUserActionRef,
          modalRequestCloseRef: mockModalRequestCloseRef,
        }),
      {
        initialProps: { modals: [createMockModal('modal-1')] },
      }
    );

    rerender({ modals: [] });

    expect(window.history.back).toHaveBeenCalled();
  });

  it('не должен вызывать window.history.back если isClosingFromHistoryRef = true', () => {
    const { rerender } = renderHook(
      ({ modals }) =>
        useModalHistory({
          modals,
          push: mockPush,
          remove: mockRemove,
          closeModal: mockCloseModal,
          userActionRef: mockUserActionRef,
          modalRequestCloseRef: mockModalRequestCloseRef,
        }),
      {
        initialProps: { modals: [createMockModal('modal-1')] },
      }
    );

    rerender({ modals: [] });

    expect(window.history.back).toHaveBeenCalled();
  });

  it('не должен вызывать window.history.back если userActionRef.current = true', () => {
    mockUserActionRef.current = true;

    const { rerender } = renderHook(
      ({ modals }) =>
        useModalHistory({
          modals,
          push: mockPush,
          remove: mockRemove,
          closeModal: mockCloseModal,
          userActionRef: mockUserActionRef,
          modalRequestCloseRef: mockModalRequestCloseRef,
        }),
      {
        initialProps: { modals: [createMockModal('modal-1')] },
      }
    );

    rerender({ modals: [] });

    expect(window.history.back).not.toHaveBeenCalled();
  });

  it('должен удалять requestClose из modalRequestCloseRef при закрытии', () => {
    const requestClose = vi.fn();
    mockModalRequestCloseRef.current.set('modal-1', requestClose);

    const { rerender } = renderHook(
      ({ modals }) =>
        useModalHistory({
          modals,
          push: mockPush,
          remove: mockRemove,
          closeModal: mockCloseModal,
          userActionRef: mockUserActionRef,
          modalRequestCloseRef: mockModalRequestCloseRef,
        }),
      {
        initialProps: { modals: [createMockModal('modal-1')] },
      }
    );

    rerender({ modals: [] });

    expect(mockModalRequestCloseRef.current.has('modal-1')).toBe(false);
  });

  it('должен обрабатывать несколько модальных окон', () => {
    const modals = [createMockModal('modal-1'), createMockModal('modal-2')];

    renderHook(() =>
      useModalHistory({
        modals,
        push: mockPush,
        remove: mockRemove,
        closeModal: mockCloseModal,
        userActionRef: mockUserActionRef,
        modalRequestCloseRef: mockModalRequestCloseRef,
      })
    );

    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenCalledWith('modal-1', expect.any(Function));
    expect(mockPush).toHaveBeenCalledWith('modal-2', expect.any(Function));
  });

  it('не должен добавлять модальное окно в историю если оно уже существует', () => {
    const modals = [createMockModal('modal-1')];

    const { rerender } = renderHook(
      ({ modals }) =>
        useModalHistory({
          modals,
          push: mockPush,
          remove: mockRemove,
          closeModal: mockCloseModal,
          userActionRef: mockUserActionRef,
          modalRequestCloseRef: mockModalRequestCloseRef,
        }),
      {
        initialProps: { modals },
      }
    );

    mockPush.mockClear();

    rerender({ modals });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('должен вызывать closeModal при вызове handleClose из push', () => {
    const modals = [createMockModal('modal-1')];

    renderHook(() =>
      useModalHistory({
        modals,
        push: mockPush,
        remove: mockRemove,
        closeModal: mockCloseModal,
        userActionRef: mockUserActionRef,
        modalRequestCloseRef: mockModalRequestCloseRef,
      })
    );

    const pushCall = mockPush.mock.calls[0];
    const handleClose = pushCall[1];

    handleClose();

    expect(mockCloseModal).toHaveBeenCalledWith('modal-1');
  });
});
