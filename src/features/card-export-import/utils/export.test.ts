import { describe, expect, it } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { ERROR_NO_CARDS_TO_EXPORT } from '../constants';
import { validateCardsForExport } from './export';

describe('validateCardsForExport', () => {
  it('должен выбрасывать ошибку при пустом массиве карт', () => {
    const emptyCards: IBankCard[] = [];

    expect(() => validateCardsForExport(emptyCards)).toThrowError(
      ERROR_NO_CARDS_TO_EXPORT,
    );
  });

  it('не должен выбрасывать ошибку при непустом массиве карт', () => {
    const cards: IBankCard[] = [
      {
        id: 'export-validate-id-1',
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
        id: 'export-validate-id-2',
        pan: '1111',
        expires: '12/25',
        name: 'Card 1',
        cvv: '111',
        pin: '1111',
        order: 0,
      },
      {
        id: 'export-validate-id-3',
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
