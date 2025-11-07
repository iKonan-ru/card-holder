import { describe, it, expect } from 'vitest';
import { validateCardForm, checkHasErrors } from './validation';
import type { IBankCard } from '@entities/bank-card';

describe('validateCardForm', () => {
  const VALID_CARD: IBankCard = {
    pan: '5555555555554444',
    expires: '1225',
    name: 'TEST USER',
    cvv: '123',
    pin: '1234',
    order: 0,
  };

  describe('PAN валидация', () => {
    it('должна отклонять пустой PAN', () => {
      const card = { ...VALID_CARD, pan: '' };
      const errors = validateCardForm(card);

      expect(errors.pan).toBeDefined();
    });

    it('должна отклонять PAN с буквами', () => {
      const card = { ...VALID_CARD, pan: '5555abc555554444' };
      const errors = validateCardForm(card);

      expect(errors.pan).toBeDefined();
    });

    it('должна отклонять короткий PAN', () => {
      const card = { ...VALID_CARD, pan: '12345' };
      const errors = validateCardForm(card);

      expect(errors.pan).toBeDefined();
    });

    it('должна отклонять невалидный PAN по алгоритму Луна', () => {
      const card = { ...VALID_CARD, pan: '1234567812345678' };
      const errors = validateCardForm(card);

      expect(errors.pan).toBeDefined();
    });

    it('должна принимать валидный PAN', () => {
      const errors = validateCardForm(VALID_CARD);

      expect(errors.pan).toBeUndefined();
    });
  });

  describe('Expires валидация', () => {
    it('должна отклонять пустую дату', () => {
      const card = { ...VALID_CARD, expires: '' };
      const errors = validateCardForm(card);

      expect(errors.expires).toBeDefined();
    });

    it('должна отклонять короткую дату', () => {
      const card = { ...VALID_CARD, expires: '123' };
      const errors = validateCardForm(card);

      expect(errors.expires).toBeDefined();
    });

    it('должна отклонять месяц больше 12', () => {
      const card = { ...VALID_CARD, expires: '1325' };
      const errors = validateCardForm(card);

      expect(errors.expires).toBeDefined();
    });

    it('должна отклонять месяц 00', () => {
      const card = { ...VALID_CARD, expires: '0025' };
      const errors = validateCardForm(card);

      expect(errors.expires).toBeDefined();
    });

    it('должна отклонять год меньше 22', () => {
      const card = { ...VALID_CARD, expires: '1221' };
      const errors = validateCardForm(card);

      expect(errors.expires).toBeDefined();
    });

    it('должна принимать валидную дату', () => {
      const errors = validateCardForm(VALID_CARD);

      expect(errors.expires).toBeUndefined();
    });
  });

  describe('Name валидация', () => {
    it('должна отклонять пустое имя', () => {
      const card = { ...VALID_CARD, name: '' };
      const errors = validateCardForm(card);

      expect(errors.name).toBeDefined();
    });

    it('должна отклонять слишком короткое имя', () => {
      const card = { ...VALID_CARD, name: 'A' };
      const errors = validateCardForm(card);

      expect(errors.name).toBeDefined();
    });

    it('должна принимать валидное имя', () => {
      const errors = validateCardForm(VALID_CARD);

      expect(errors.name).toBeUndefined();
    });
  });

  describe('CVV валидация', () => {
    it('должна отклонять пустой CVV', () => {
      const card = { ...VALID_CARD, cvv: '' };
      const errors = validateCardForm(card);

      expect(errors.cvv).toBeDefined();
    });

    it('должна отклонять короткий CVV', () => {
      const card = { ...VALID_CARD, cvv: '12' };
      const errors = validateCardForm(card);

      expect(errors.cvv).toBeDefined();
    });

    it('должна принимать валидный CVV', () => {
      const errors = validateCardForm(VALID_CARD);

      expect(errors.cvv).toBeUndefined();
    });
  });

  describe('PIN валидация', () => {
    it('должна принимать пустой PIN', () => {
      const card = { ...VALID_CARD, pin: '' };
      const errors = validateCardForm(card);

      expect(errors.pin).toBeUndefined();
    });

    it('должна отклонять короткий PIN', () => {
      const card = { ...VALID_CARD, pin: '123' };
      const errors = validateCardForm(card);

      expect(errors.pin).toBeDefined();
    });

    it('должна принимать валидный PIN', () => {
      const errors = validateCardForm(VALID_CARD);

      expect(errors.pin).toBeUndefined();
    });
  });
});

describe('checkHasErrors', () => {
  it('должна возвращать true если есть ошибки', () => {
    const errors = { pan: 'Error', cvv: 'Error' };

    expect(checkHasErrors(errors)).toBe(true);
  });

  it('должна возвращать false если нет ошибок', () => {
    const errors = {};

    expect(checkHasErrors(errors)).toBe(false);
  });
});

describe('validateCardForm - граничные случаи', () => {
  it('должна обрабатывать undefined значения полей', () => {
    const card = {
      pan: undefined,
      expires: undefined,
      name: undefined,
      cvv: undefined,
      pin: undefined,
    };

    const errors = validateCardForm(card);

    expect(errors.pan).toBeDefined();
    expect(errors.expires).toBeDefined();
    expect(errors.name).toBeDefined();
    expect(errors.cvv).toBeDefined();
  });
});
