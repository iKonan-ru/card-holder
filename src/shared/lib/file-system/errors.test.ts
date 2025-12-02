import { describe, expect, it } from 'vitest';
import { FILE_SELECTION_CANCELLED_ERROR } from './constants';
import {
  checkIsFileSelectionCancelled,
  createFileSelectionCancelledError,
} from './errors';

describe('createFileSelectionCancelledError', () => {
  it('должен создавать Error с правильным сообщением', () => {
    const error = createFileSelectionCancelledError();

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(FILE_SELECTION_CANCELLED_ERROR);
  });

  it('должен создавать новые экземпляры при каждом вызове', () => {
    const error1 = createFileSelectionCancelledError();
    const error2 = createFileSelectionCancelledError();

    expect(error1).not.toBe(error2);
    expect(error1.message).toBe(error2.message);
  });
});

describe('checkIsFileSelectionCancelled', () => {
  it('должен возвращать true для ошибки отмены выбора файла', () => {
    const error = createFileSelectionCancelledError();

    expect(checkIsFileSelectionCancelled(error)).toBe(true);
  });

  it('должен возвращать false для обычной ошибки', () => {
    const error = new Error('Some other error');

    expect(checkIsFileSelectionCancelled(error)).toBe(false);
  });

  it('должен возвращать false для строки', () => {
    const error = FILE_SELECTION_CANCELLED_ERROR;

    expect(checkIsFileSelectionCancelled(error)).toBe(false);
  });

  it('должен возвращать false для null', () => {
    expect(checkIsFileSelectionCancelled(null)).toBe(false);
  });

  it('должен возвращать false для undefined', () => {
    expect(checkIsFileSelectionCancelled(undefined)).toBe(false);
  });

  it('должен возвращать false для объекта', () => {
    const error = { message: FILE_SELECTION_CANCELLED_ERROR };

    expect(checkIsFileSelectionCancelled(error)).toBe(false);
  });

  it('должен возвращать false для Error с другим сообщением', () => {
    const error = new Error('Different message');

    expect(checkIsFileSelectionCancelled(error)).toBe(false);
  });

  it('должен быть type guard для Error типа', () => {
    const error: unknown = createFileSelectionCancelledError();

    if (checkIsFileSelectionCancelled(error)) {
      expect((error as Error).message).toBe(FILE_SELECTION_CANCELLED_ERROR);
    }
  });
});
