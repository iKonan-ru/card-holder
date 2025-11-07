import { describe, it, expect } from 'vitest';
import { translateError, extractErrorMessage } from './utils';
import { DEFAULT_ERROR_MESSAGE } from './constants';

describe('translateError', () => {
  it('должен переводить известные ошибки', () => {
    const result = translateError('Failed to add card');

    expect(result).toBe('Не удалось добавить карту');
  });

  it('должен переводить ошибку загрузки карт', () => {
    const result = translateError('Failed to load cards');

    expect(result).toBe('Не удалось загрузить карты');
  });

  it('должен переводить ошибку удаления карты', () => {
    const result = translateError('Failed to delete card');

    expect(result).toBe('Не удалось удалить карту');
  });

  it('должен переводить ошибку обновления карты', () => {
    const result = translateError('Failed to update card');

    expect(result).toBe('Не удалось обновить карту');
  });

  it('должен переводить ошибку изменения порядка карт', () => {
    const result = translateError('Failed to reorder cards');

    expect(result).toBe('Не удалось изменить порядок карт');
  });

  it('должен возвращать дефолтное сообщение для неизвестной ошибки', () => {
    const result = translateError('Unknown error message');

    expect(result).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('должен возвращать дефолтное сообщение для пустой строки', () => {
    const result = translateError('');

    expect(result).toBe(DEFAULT_ERROR_MESSAGE);
  });
});

describe('extractErrorMessage', () => {
  it('должен извлекать сообщение из объекта Error', () => {
    const error = new Error('Test error message');
    const result = extractErrorMessage(error);

    expect(result).toBe('Test error message');
  });

  it('должен возвращать строку если передана строка', () => {
    const result = extractErrorMessage('String error');

    expect(result).toBe('String error');
  });

  it('должен возвращать дефолтное сообщение для null', () => {
    const result = extractErrorMessage(null);

    expect(result).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('должен возвращать дефолтное сообщение для undefined', () => {
    const result = extractErrorMessage(undefined);

    expect(result).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('должен возвращать дефолтное сообщение для числа', () => {
    const result = extractErrorMessage(123);

    expect(result).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('должен возвращать дефолтное сообщение для объекта', () => {
    const result = extractErrorMessage({ custom: 'error' });

    expect(result).toBe(DEFAULT_ERROR_MESSAGE);
  });
});
