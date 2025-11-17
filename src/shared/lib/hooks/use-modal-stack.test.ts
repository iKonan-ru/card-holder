import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useModalStack } from '@shared/lib';

describe('useModalStack', () => {
  beforeEach(() => {
    useModalStack.getState().clear();
  });

  it('должен добавлять модалку в стек', () => {
    const onClose = vi.fn();
    const modalId = 'modal-1';
    const { push, getSize, isTop } = useModalStack.getState();

    push(modalId, onClose);

    expect(getSize()).toBe(1);
    expect(isTop(modalId)).toBe(true);
  });

  it('должен определять верхнюю модалку', () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const modalId1 = 'modal-1';
    const modalId2 = 'modal-2';
    const { push, isTop } = useModalStack.getState();

    push(modalId1, onClose1);
    push(modalId2, onClose2);

    expect(isTop(modalId1)).toBe(false);
    expect(isTop(modalId2)).toBe(true);
  });

  it('должен удалять модалку из стека', () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const modalId1 = 'modal-1';
    const modalId2 = 'modal-2';
    const { push, remove, getSize, isTop } = useModalStack.getState();

    push(modalId1, onClose1);
    push(modalId2, onClose2);
    remove(modalId1);

    expect(getSize()).toBe(1);
    expect(isTop(modalId2)).toBe(true);
  });

  it('должен закрывать верхнюю модалку', () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const modalId1 = 'modal-1';
    const modalId2 = 'modal-2';
    const { push, closeTop } = useModalStack.getState();

    push(modalId1, onClose1);
    push(modalId2, onClose2);

    const result = closeTop();

    expect(result).toBe(true);
    expect(onClose2).toHaveBeenCalledTimes(1);
    expect(onClose1).not.toHaveBeenCalled();
  });

  it('должен возвращать false при попытке закрыть пустой стек', () => {
    const { closeTop } = useModalStack.getState();
    const result = closeTop();

    expect(result).toBe(false);
  });

  it('должен корректно работать с подписками', () => {
    const listener = vi.fn();
    const onClose = vi.fn();
    const modalId = 'modal-1';
    const { push, remove } = useModalStack.getState();

    const unsubscribe = useModalStack.subscribe(listener);

    push(modalId, onClose);

    expect(listener).toHaveBeenCalledTimes(1);

    remove(modalId);

    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();

    push(modalId, onClose);

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('должен возвращать корректный размер стека', () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const onClose3 = vi.fn();
    const modalId1 = 'modal-1';
    const modalId2 = 'modal-2';
    const modalId3 = 'modal-3';
    const { push, remove, getSize } = useModalStack.getState();

    expect(getSize()).toBe(0);

    push(modalId1, onClose1);
    expect(getSize()).toBe(1);

    push(modalId2, onClose2);
    expect(getSize()).toBe(2);

    push(modalId3, onClose3);
    expect(getSize()).toBe(3);

    remove(modalId2);
    expect(getSize()).toBe(2);

    remove(modalId1);
    expect(getSize()).toBe(1);

    remove(modalId3);
    expect(getSize()).toBe(0);
  });

  it('должен корректно определять isTop для пустого стека', () => {
    const { isTop } = useModalStack.getState();

    expect(isTop('modal-1')).toBe(false);
  });

  it('должен удалять модалку из середины стека', () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const onClose3 = vi.fn();
    const modalId1 = 'modal-1';
    const modalId2 = 'modal-2';
    const modalId3 = 'modal-3';
    const { push, remove, getSize, isTop } = useModalStack.getState();

    push(modalId1, onClose1);
    push(modalId2, onClose2);
    push(modalId3, onClose3);

    remove(modalId2);

    expect(getSize()).toBe(2);
    expect(isTop(modalId3)).toBe(true);
  });
});
