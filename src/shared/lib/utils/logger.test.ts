import { describe, it, expect, vi, afterEach } from 'vitest';
import { logError } from './logger';

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
      testError
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
      testError
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
      testError
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
      testError
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
      '[Card Holder] [TestContext] Test message'
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
      '[Card Holder] [TestContext] Test message'
    );
  });
});
