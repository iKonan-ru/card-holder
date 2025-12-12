import { afterEach, describe, expect, it, vi } from 'vitest';
import { logError, setErrorModalHandler } from './logger';

describe('logError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен логировать ошибку с уровнем error по умолчанию', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Test error');

    logError({ message: 'Test message', error: testError });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] Test message',
      testError,
    );
  });

  it('должен логировать ошибку без объекта error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    logError({ message: 'Test message' });

    expect(consoleErrorSpy).toHaveBeenCalledWith('[Card Holder] Test message');
  });

  it('должен логировать ошибку с контекстом', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Test error');

    logError({
      message: 'Test message',
      error: testError,
      context: 'TestContext',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Card Holder] [TestContext] Test message',
      testError,
    );
  });

  it('должен логировать с уровнем warn', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const testError = new Error('Test error');

    logError({
      message: 'Test message',
      error: testError,
      level: 'warn',
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[Card Holder] Test message',
      testError,
    );
  });

  it('должен логировать с уровнем warn без объекта error', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    logError({
      message: 'Test message',
      level: 'warn',
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith('[Card Holder] Test message');
  });

  it('должен логировать с уровнем info', () => {
    const consoleInfoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => {});
    const testError = new Error('Test error');

    logError({
      message: 'Test message',
      error: testError,
      level: 'info',
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '[Card Holder] Test message',
      testError,
    );
  });

  it('должен логировать с уровнем info без объекта error', () => {
    const consoleInfoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => {});

    logError({
      message: 'Test message',
      level: 'info',
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith('[Card Holder] Test message');
  });

  it('должен логировать с контекстом и уровнем warn', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    logError({
      message: 'Test message',
      level: 'warn',
      context: 'TestContext',
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[Card Holder] [TestContext] Test message',
    );
  });

  it('должен логировать с контекстом и уровнем info', () => {
    const consoleInfoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => {});

    logError({
      message: 'Test message',
      level: 'info',
      context: 'TestContext',
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '[Card Holder] [TestContext] Test message',
    );
  });

  it('должен вызывать errorModalHandler для уровня error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const modalHandler = vi.fn();
    const testError = new Error('Test error');

    setErrorModalHandler(modalHandler);

    logError({
      message: 'Test message',
      error: testError,
      context: 'TestContext',
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(modalHandler).toHaveBeenCalledWith({
      message: 'Test message',
      error: testError,
      context: 'TestContext',
    });

    setErrorModalHandler(null);
  });

  it('не должен вызывать errorModalHandler для уровня warn', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const modalHandler = vi.fn();

    setErrorModalHandler(modalHandler);

    logError({
      message: 'Test message',
      level: 'warn',
    });

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(modalHandler).not.toHaveBeenCalled();

    setErrorModalHandler(null);
  });

  it('не должен вызывать errorModalHandler для уровня info', () => {
    const consoleInfoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => {});
    const modalHandler = vi.fn();

    setErrorModalHandler(modalHandler);

    logError({
      message: 'Test message',
      level: 'info',
    });

    expect(consoleInfoSpy).toHaveBeenCalled();
    expect(modalHandler).not.toHaveBeenCalled();

    setErrorModalHandler(null);
  });

  it('не должен вызывать errorModalHandler когда silent=true', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const modalHandler = vi.fn();
    const testError = new Error('Test error');

    setErrorModalHandler(modalHandler);

    logError({
      message: 'Test message',
      error: testError,
      silent: true,
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(modalHandler).not.toHaveBeenCalled();

    setErrorModalHandler(null);
  });

  it('должен корректно обновлять errorModalHandler', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    setErrorModalHandler(firstHandler);

    logError({
      message: 'First message',
    });

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).not.toHaveBeenCalled();

    setErrorModalHandler(secondHandler);

    logError({
      message: 'Second message',
    });

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);

    setErrorModalHandler(null);
  });
});
