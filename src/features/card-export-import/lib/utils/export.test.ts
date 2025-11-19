import { describe, it, expect } from 'vitest';
import { validateCardsForExport, prepareCardsForExport } from './export';
import type { IBankCard } from '@entities/bank-card';
import { ERROR_NO_CARDS_TO_EXPORT } from '../constants';

describe('validateCardsForExport', () => {
  it('должен выбрасывать ошибку при пустом массиве карт', () => {
    const emptyCards: IBankCard[] = [];

    expect(() => validateCardsForExport(emptyCards)).toThrowError(
      ERROR_NO_CARDS_TO_EXPORT
    );
  });

  it('не должен выбрасывать ошибку при непустом массиве карт', () => {
    const cards: IBankCard[] = [
      {
        pan: '1234567890123456',
        expires: '12/25',
        name: 'Test Card',
        cvv: '123',
        pin: '1234',
        order: 0,
      },
    ];

    expect(() => validateCardsForExport(cards)).not.toThrow();
  });

  it('не должен выбрасывать ошибку при массиве с несколькими картами', () => {
    const cards: IBankCard[] = [
      {
        pan: '1111',
        expires: '12/25',
        name: 'Card 1',
        cvv: '111',
        pin: '1111',
        order: 0,
      },
      {
        pan: '2222',
        expires: '11/26',
        name: 'Card 2',
        cvv: '222',
        pin: '2222',
        order: 1,
      },
    ];

    expect(() => validateCardsForExport(cards)).not.toThrow();
  });
});

describe('prepareCardsForExport', () => {
  it('должен преобразовывать массив карт в JSON строку', () => {
    const cards: IBankCard[] = [
      {
        pan: '1234567890123456',
        expires: '12/25',
        name: 'Test Card',
        cvv: '123',
        pin: '1234',
        order: 0,
      },
    ];

    const result = prepareCardsForExport(cards);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual(cards);
  });

  it('должен обрабатывать пустой массив', () => {
    const cards: IBankCard[] = [];

    const result = prepareCardsForExport(cards);

    expect(result).toBe('[]');
  });

  it('должен обрабатывать несколько карт', () => {
    const cards: IBankCard[] = [
      {
        pan: '1111',
        expires: '12/25',
        name: 'Card 1',
        cvv: '111',
        pin: '1111',
        order: 0,
      },
      {
        pan: '2222',
        expires: '11/26',
        name: 'Card 2',
        cvv: '222',
        pin: '2222',
        order: 1,
      },
    ];

    const result = prepareCardsForExport(cards);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual(cards);
    expect(parsed).toHaveLength(2);
  });

  it('должен сохранять все поля карты', () => {
    const cards: IBankCard[] = [
      {
        pan: '1234567890123456',
        expires: '12/25',
        name: 'Test Card',
        cvv: '123',
        pin: '1234',
        order: 5,
      },
    ];

    const result = prepareCardsForExport(cards);
    const parsed = JSON.parse(result)[0] as IBankCard;

    expect(parsed.pan).toBe('1234567890123456');
    expect(parsed.expires).toBe('12/25');
    expect(parsed.name).toBe('Test Card');
    expect(parsed.cvv).toBe('123');
    expect(parsed.pin).toBe('1234');
    expect(parsed.order).toBe(5);
  });
});
