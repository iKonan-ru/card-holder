import { describe, expect, it } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { FILE_FORMAT_VERSION, type IEncryptedPayload } from '@shared/lib';
import { ERROR_CORRUPTED_FILE, ERROR_UNSUPPORTED_VERSION } from '../constants';
import {
  mergeCards,
  parseDecryptedCards,
  parseImportedFile,
  validateImportedPayload,
} from './import';

describe('parseImportedFile', () => {
  it('должен парсить валидный JSON', () => {
    const payload: IEncryptedPayload = {
      version: 1,
      timestamp: Date.now(),
      salt: 'test-salt',
      iv: 'test-iv',
      encrypted: 'test-encrypted',
    };
    const fileContent = JSON.stringify(payload);

    const result = parseImportedFile(fileContent);

    expect(result).toEqual(payload);
  });

  it('должен выбрасывать ошибку при пустой строке', () => {
    expect(() => parseImportedFile('')).toThrowError(ERROR_CORRUPTED_FILE);
  });

  it('должен выбрасывать ошибку при строке только из пробелов', () => {
    expect(() => parseImportedFile('   ')).toThrowError(ERROR_CORRUPTED_FILE);
  });

  it('должен выбрасывать ошибку при невалидном JSON', () => {
    expect(() => parseImportedFile('not a json')).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });

  it('должен выбрасывать ошибку при частично валидном JSON', () => {
    expect(() => parseImportedFile('{"key": "value"')).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });
});

describe('validateImportedPayload', () => {
  const validPayload: IEncryptedPayload = {
    version: FILE_FORMAT_VERSION,
    timestamp: Date.now(),
    salt: 'test-salt',
    iv: 'test-iv',
    encrypted: 'test-encrypted',
  };

  it('должен успешно валидировать правильный payload', () => {
    expect(() => validateImportedPayload(validPayload)).not.toThrow();
  });

  it('должен выбрасывать ошибку при отсутствии version', () => {
    const invalid = {
      ...validPayload,
      version: undefined,
    } as unknown as IEncryptedPayload;

    expect(() => validateImportedPayload(invalid)).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });

  it('должен выбрасывать ошибку при неправильной версии', () => {
    const invalid = { ...validPayload, version: 999 };

    expect(() => validateImportedPayload(invalid)).toThrowError(
      ERROR_UNSUPPORTED_VERSION,
    );
  });

  it('должен выбрасывать ошибку при отсутствии timestamp', () => {
    const invalid = {
      ...validPayload,
      timestamp: undefined,
    } as unknown as IEncryptedPayload;

    expect(() => validateImportedPayload(invalid)).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });

  it('должен выбрасывать ошибку при отсутствии salt', () => {
    const invalid = {
      ...validPayload,
      salt: undefined,
    } as unknown as IEncryptedPayload;

    expect(() => validateImportedPayload(invalid)).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });

  it('должен выбрасывать ошибку при отсутствии iv', () => {
    const invalid = {
      ...validPayload,
      iv: undefined,
    } as unknown as IEncryptedPayload;

    expect(() => validateImportedPayload(invalid)).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });

  it('должен выбрасывать ошибку при отсутствии encrypted', () => {
    const invalid = {
      ...validPayload,
      encrypted: undefined,
    } as unknown as IEncryptedPayload;

    expect(() => validateImportedPayload(invalid)).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });
});

describe('parseDecryptedCards', () => {
  const mockCard: IBankCard = {
    pan: '1234567890123456',
    expires: '12/25',
    name: 'Test Card',
    cvv: '123',
    pin: '1234',
    order: 0,
  };

  it('должен парсить валидный JSON массив карт', () => {
    const cards = [mockCard];
    const decryptedData = JSON.stringify(cards);

    const result = parseDecryptedCards(decryptedData);

    expect(result).toEqual(cards);
  });

  it('должен парсить пустой массив', () => {
    const decryptedData = JSON.stringify([]);

    const result = parseDecryptedCards(decryptedData);

    expect(result).toEqual([]);
  });

  it('должен выбрасывать ошибку при невалидном JSON', () => {
    expect(() => parseDecryptedCards('invalid json')).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });

  it('должен выбрасывать ошибку если данные не массив', () => {
    const notArray = JSON.stringify({ key: 'value' });

    expect(() => parseDecryptedCards(notArray)).toThrowError(
      ERROR_CORRUPTED_FILE,
    );
  });

  it('должен парсить несколько карт', () => {
    const cards = [
      mockCard,
      { ...mockCard, pan: '9876543210987654', name: 'Another Card' },
    ];
    const decryptedData = JSON.stringify(cards);

    const result = parseDecryptedCards(decryptedData);

    expect(result).toHaveLength(2);
    expect(result).toEqual(cards);
  });
});

describe('mergeCards', () => {
  const card1: IBankCard = {
    pan: '1111',
    expires: '12/25',
    name: 'Card 1',
    cvv: '111',
    pin: '1111',
    order: 0,
  };

  const card2: IBankCard = {
    pan: '2222',
    expires: '11/26',
    name: 'Card 2',
    cvv: '222',
    pin: '2222',
    order: 1,
  };

  it('должен добавлять новые карты', () => {
    const existingCards: IBankCard[] = [card1];
    const importedCards: IBankCard[] = [card2];

    const result = mergeCards(existingCards, importedCards);

    expect(result.cards).toHaveLength(2);
    expect(result.cards).toContainEqual(card1);
    expect(result.cards).toContainEqual(card2);
    expect(result.stats.imported).toBe(1);
    expect(result.stats.replaced).toBe(0);
    expect(result.stats.total).toBe(1);
  });

  it('должен заменять существующие карты', () => {
    const existingCards: IBankCard[] = [card1];
    const updatedCard1 = { ...card1, name: 'Updated Card 1' };
    const importedCards: IBankCard[] = [updatedCard1];

    const result = mergeCards(existingCards, importedCards);

    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].name).toBe('Updated Card 1');
    expect(result.stats.imported).toBe(0);
    expect(result.stats.replaced).toBe(1);
    expect(result.stats.total).toBe(1);
  });

  it('должен обрабатывать смешанные операции', () => {
    const existingCards: IBankCard[] = [card1, card2];
    const updatedCard1 = { ...card1, name: 'Updated Card 1' };
    const card3: IBankCard = {
      ...card1,
      pan: '3333',
      name: 'Card 3',
      order: 2,
    };
    const importedCards: IBankCard[] = [updatedCard1, card3];

    const result = mergeCards(existingCards, importedCards);

    expect(result.cards).toHaveLength(3);
    expect(result.stats.imported).toBe(1);
    expect(result.stats.replaced).toBe(1);
    expect(result.stats.total).toBe(2);
  });

  it('должен обрабатывать пустой существующий список', () => {
    const existingCards: IBankCard[] = [];
    const importedCards: IBankCard[] = [card1, card2];

    const result = mergeCards(existingCards, importedCards);

    expect(result.cards).toHaveLength(2);
    expect(result.stats.imported).toBe(2);
    expect(result.stats.replaced).toBe(0);
    expect(result.stats.total).toBe(2);
  });

  it('должен обрабатывать пустой импортируемый список', () => {
    const existingCards: IBankCard[] = [card1, card2];
    const importedCards: IBankCard[] = [];

    const result = mergeCards(existingCards, importedCards);

    expect(result.cards).toHaveLength(2);
    expect(result.stats.imported).toBe(0);
    expect(result.stats.replaced).toBe(0);
    expect(result.stats.total).toBe(0);
  });

  it('не должен изменять исходные массивы', () => {
    const existingCards: IBankCard[] = [card1];
    const importedCards: IBankCard[] = [card2];

    mergeCards(existingCards, importedCards);

    expect(existingCards).toHaveLength(1);
    expect(importedCards).toHaveLength(1);
  });
});
