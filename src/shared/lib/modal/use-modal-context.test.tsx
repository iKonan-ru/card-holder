import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { useModalContext } from '@shared/lib';
import { ModalContext } from './context';

const mockContextValue = {
  modals: [],
  openModal: vi.fn(),
  closeModal: vi.fn(),
  closeAllModals: vi.fn(),
  updateModalPreventClose: vi.fn(),
  userActionRef: { current: false },
};

describe('useModalContext', () => {
  it('должен возвращать значение контекста', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <ModalContext.Provider value={mockContextValue}>
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useModalContext(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });

  it('должен выбрасывать ошибку если используется вне ModalProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useModalContext());
    }).toThrow('useModalContext must be used within ModalProvider');

    consoleError.mockRestore();
  });
});
