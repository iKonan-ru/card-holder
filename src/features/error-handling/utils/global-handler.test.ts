import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initGlobalErrorHandler } from './global-handler';
import * as showErrorModule from './show-error';

describe('initGlobalErrorHandler', () => {
  let showErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    showErrorSpy = vi
      .spyOn(showErrorModule, 'showError')
      .mockImplementation(() => {}) as ReturnType<typeof vi.fn>;
  });

  afterEach(() => {
    showErrorSpy.mockRestore();
  });

  it('должен обрабатывать глобальные ошибки', () => {
    showErrorSpy.mockClear();
    initGlobalErrorHandler();

    const error = new Error('Test error');
    const errorEvent = new ErrorEvent('error', {
      error,
      message: 'Test error message',
    });

    window.dispatchEvent(errorEvent);

    expect(showErrorSpy).toHaveBeenCalled();
    expect(showErrorSpy).toHaveBeenCalledWith({
      message: 'Test error message',
      error,
      context: 'GlobalErrorHandler',
    });
  });

  it('должен обрабатывать необработанные Promise ошибки', () => {
    showErrorSpy.mockClear();
    initGlobalErrorHandler();

    const error = new Error('Promise rejection');
    const rejectedPromise = Promise.reject(error);

    rejectedPromise.catch(() => {});

    const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      promise: rejectedPromise,
      reason: error,
    });

    window.dispatchEvent(rejectionEvent);

    expect(showErrorSpy).toHaveBeenCalled();
    expect(showErrorSpy).toHaveBeenCalledWith({
      message: 'Необработанная ошибка Promise',
      error,
      context: 'GlobalErrorHandler',
    });
  });

  it('должен предотвращать дефолтное поведение браузера', () => {
    showErrorSpy.mockClear();
    initGlobalErrorHandler();

    const errorEvent = new ErrorEvent('error', {
      error: new Error('Test'),
      message: 'Test',
    });

    const preventDefaultSpy = vi.spyOn(errorEvent, 'preventDefault');

    window.dispatchEvent(errorEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
