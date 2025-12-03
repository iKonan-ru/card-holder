import { describe, expect, it } from 'vitest';
import {
  validateCvv,
  validateExpires,
  validateName,
  validatePan,
  validatePin,
} from './field-validators';

describe('validatePan', () => {
  it('должна возвращать ошибку для пустого значения', () => {
    expect(validatePan('')).toBeDefined();
  });

  it('должна возвращать ошибку для нецифровых символов', () => {
    expect(validatePan('5555abc555554444')).toBeDefined();
  });

  it('должна возвращать ошибку для короткого номера', () => {
    expect(validatePan('12345')).toBeDefined();
  });

  it('должна возвращать ошибку для невалидного номера по Луну', () => {
    expect(validatePan('1234567812345678')).toBeDefined();
  });

  it('должна возвращать undefined для валидного номера', () => {
    expect(validatePan('5555555555554444')).toBeUndefined();
  });
});

describe('validateExpires', () => {
  it('должна возвращать ошибку для пустого значения', () => {
    expect(validateExpires('')).toBeDefined();
  });

  it('должна возвращать ошибку для короткой даты', () => {
    expect(validateExpires('123')).toBeDefined();
  });

  it('должна возвращать ошибку для месяца больше 12', () => {
    expect(validateExpires('1325')).toBeDefined();
  });

  it('должна возвращать ошибку для нулевого месяца', () => {
    expect(validateExpires('0025')).toBeDefined();
  });

  it('должна возвращать ошибку для года меньше 22', () => {
    expect(validateExpires('1221')).toBeDefined();
  });

  it('должна возвращать undefined для валидной даты', () => {
    expect(validateExpires('1225')).toBeUndefined();
  });
});

describe('validateName', () => {
  it('должна возвращать ошибку для пустого значения', () => {
    expect(validateName('')).toBeDefined();
  });

  it('должна возвращать ошибку для слишком короткого имени', () => {
    expect(validateName('A')).toBeDefined();
  });

  it('должна возвращать undefined для валидного имени', () => {
    expect(validateName('TEST USER')).toBeUndefined();
  });
});

describe('validateCvv', () => {
  it('должна возвращать ошибку для пустого значения', () => {
    expect(validateCvv('')).toBeDefined();
  });

  it('должна возвращать ошибку для короткого CVV', () => {
    expect(validateCvv('12')).toBeDefined();
  });

  it('должна возвращать ошибку для длинного CVV', () => {
    expect(validateCvv('1234')).toBeDefined();
  });

  it('должна возвращать undefined для валидного CVV', () => {
    expect(validateCvv('123')).toBeUndefined();
  });
});

describe('validatePin', () => {
  it('должна возвращать undefined для пустого значения', () => {
    expect(validatePin('')).toBeUndefined();
  });

  it('должна возвращать ошибку для короткого PIN', () => {
    expect(validatePin('123')).toBeDefined();
  });

  it('должна возвращать ошибку для длинного PIN', () => {
    expect(validatePin('12345')).toBeDefined();
  });

  it('должна возвращать undefined для валидного PIN', () => {
    expect(validatePin('1234')).toBeUndefined();
  });
});
