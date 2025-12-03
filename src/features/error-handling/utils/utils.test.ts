import { describe, expect, it } from 'vitest';
import { DEFAULT_ERROR_MESSAGE } from '../constants';
import { extractErrorMessage, translateError } from './utils';

describe('translateError', () => {
  it('должен возвращать переданное сообщение если оно не пустое', () => {
    const result = translateError('Не удалось добавить карту');

    expect(result).toBe('Не удалось добавить карту');
  });

  it('должен возвращать дефолтное сообщение для пустой строки', () => {
    const result = translateError('');

    expect(result).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('должен возвращать дефолтное сообщение для строки с пробелами', () => {
    const result = translateError('   ');

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
