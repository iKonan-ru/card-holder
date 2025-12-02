import type { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalCloseContext, useModalClose } from './use-modal-close';

const mockClose = vi.fn();

describe('ModalCloseContext', () => {
  it('должен быть создан', () => {
    expect(ModalCloseContext).toBeDefined();
  });
});

describe('useModalClose', () => {
  it('должен возвращать функцию закрытия из контекста', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <ModalCloseContext.Provider value={mockClose}>
        {children}
      </ModalCloseContext.Provider>
    );

    const { result } = renderHook(() => useModalClose(), { wrapper });

    expect(result.current).toBe(mockClose);
  });

  it('должен возвращать пустую функцию если контекст не предоставлен', () => {
    const { result } = renderHook(() => useModalClose());

    expect(typeof result.current).toBe('function');
    expect(result.current).not.toBe(mockClose);
  });

  it('должен вызывать функцию закрытия из контекста', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <ModalCloseContext.Provider value={mockClose}>
        {children}
      </ModalCloseContext.Provider>
    );

    const { result } = renderHook(() => useModalClose(), { wrapper });

    result.current();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
