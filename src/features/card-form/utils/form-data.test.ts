import { describe, expect, it } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { EMPTY_CARD_FORM } from '../constants';
import { getInitialFormData } from './form-data';

const EMPTY_ADDRESS = EMPTY_CARD_FORM.address;

describe('getInitialFormData', () => {
  it('должна возвращать пустую форму, если initialCard не передана', () => {
    const result = getInitialFormData();

    expect(result).toEqual(EMPTY_CARD_FORM);
  });

  it('должна возвращать пустую форму, если initialCard undefined', () => {
    const result = getInitialFormData(undefined);

    expect(result).toEqual(EMPTY_CARD_FORM);
  });

  it('должна форматировать pan и expires из initialCard', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '5559494202595236',
      expires: '0726',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
    };

    const result = getInitialFormData(initialCard);

    expect(result).toEqual({
      pan: '5559 4942 0259 5236',
      expires: '07/26',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
      address: EMPTY_ADDRESS,
    });
  });

  it('должна обрабатывать пустые pan и expires', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '',
      expires: '',
      name: 'TEST USER',
      cvv: '123',
    };

    const result = getInitialFormData(initialCard);

    expect(result).toEqual({
      pan: '',
      expires: '',
      name: 'TEST USER',
      cvv: '123',
      address: EMPTY_ADDRESS,
    });
  });

  it('должна сохранять все дополнительные поля из initialCard', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '4377723769243191',
      expires: '1225',
      name: 'ANOTHER USER',
      cvv: '456',
      pin: '5678',
      type: 'Дебетовая',
      phrase: 'Кодовое слово',
    };

    const result = getInitialFormData(initialCard);

    expect(result).toEqual({
      pan: '4377 7237 6924 3191',
      expires: '12/25',
      name: 'ANOTHER USER',
      cvv: '456',
      pin: '5678',
      type: 'Дебетовая',
      phrase: 'Кодовое слово',
      address: EMPTY_ADDRESS,
    });
  });

  it('должна обрабатывать initialCard только с pan', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '1234567812345678',
    };

    const result = getInitialFormData(initialCard);

    expect(result).toEqual({
      pan: '1234 5678 1234 5678',
      expires: '',
      address: EMPTY_ADDRESS,
    });
  });

  it('должна обрабатывать initialCard только с expires', () => {
    const initialCard: Partial<IBankCard> = {
      expires: '0628',
    };

    const result = getInitialFormData(initialCard);

    expect(result).toEqual({
      pan: '',
      expires: '06/28',
      address: EMPTY_ADDRESS,
    });
  });

  it('должна корректно форматировать частичный pan', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '12345',
      expires: '12',
    };

    const result = getInitialFormData(initialCard);

    expect(result).toEqual({
      pan: '1234 5',
      expires: '12',
      address: EMPTY_ADDRESS,
    });
  });

  it('должна сохранять уже заполненный address из initialCard', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '4377723769243191',
      expires: '1225',
      name: 'USER',
      cvv: '123',
      address: {
        line1: '123 Main St',
        city: 'Moscow',
        zip: '101000',
      },
    };

    const result = getInitialFormData(initialCard);

    expect(result).toEqual({
      pan: '4377 7237 6924 3191',
      expires: '12/25',
      name: 'USER',
      cvv: '123',
      address: {
        line1: '123 Main St',
        line2: '',
        city: 'Moscow',
        state: '',
        county: '',
        zip: '101000',
      },
    });
  });
});
