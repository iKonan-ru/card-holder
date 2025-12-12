import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ModalProvider } from '@shared/lib';
import * as utils from '../../utils';
import { ErrorHandlerProvider } from './error-handler-provider';

describe('ErrorHandlerProvider', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен рендерить children', () => {
    render(
      <ModalProvider>
        <ErrorHandlerProvider>
          <div data-testid="test-child">Test Child</div>
        </ErrorHandlerProvider>
      </ModalProvider>,
    );

    const child = document.querySelector('[data-testid="test-child"]');

    expect(child).toBeInTheDocument();
  });

  it('должен инициализировать контекст модальных окон', () => {
    const setModalContextSpy = vi.spyOn(utils, 'setModalContext');

    render(
      <ModalProvider>
        <ErrorHandlerProvider>
          <div>Test</div>
        </ErrorHandlerProvider>
      </ModalProvider>,
    );

    expect(setModalContextSpy).toHaveBeenCalledTimes(1);
    expect(setModalContextSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        openModal: expect.any(Function),
        closeModal: expect.any(Function),
        closeAllModals: expect.any(Function),
      }),
    );

    setModalContextSpy.mockRestore();
  });

  it('должен работать с несколькими children', () => {
    render(
      <ModalProvider>
        <ErrorHandlerProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ErrorHandlerProvider>
      </ModalProvider>,
    );

    expect(
      document.querySelector('[data-testid="child-1"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="child-2"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="child-3"]'),
    ).toBeInTheDocument();
  });
});
