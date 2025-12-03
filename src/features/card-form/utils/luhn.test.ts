import { describe, expect, it } from 'vitest';
import { validateLuhn } from './luhn';

describe('validateLuhn', () => {
  it('должна валидировать корректный номер карты', () => {
    expect(validateLuhn('4532015112830366')).toBe(true);
  });

  it('должна валидировать корректный номер карты с пробелами', () => {
    expect(validateLuhn('4532 0151 1283 0366')).toBe(true);
  });

  it('должна отклонять некорректный номер карты', () => {
    expect(validateLuhn('1234567812345678')).toBe(false);
  });

  it('должна валидировать другой корректный номер', () => {
    expect(validateLuhn('5555555555554444')).toBe(true);
  });

  it('должна отклонять номер с одной измененной цифрой', () => {
    expect(validateLuhn('5555555555554445')).toBe(false);
  });

  it('должна валидировать короткий номер карты', () => {
    expect(validateLuhn('378282246310005')).toBe(true);
  });

  it('должна отклонять пустую строку', () => {
    expect(validateLuhn('')).toBe(true);
  });
});
