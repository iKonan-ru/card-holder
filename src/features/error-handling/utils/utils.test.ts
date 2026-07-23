import { describe, expect, it } from 'vitest';
import { DEFAULT_ERROR_MESSAGE } from '../constants';
import { translateError } from './utils';

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
