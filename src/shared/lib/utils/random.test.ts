import { describe, expect, it, vi } from 'vitest';
import { generateRandomId } from './random';

describe('generateRandomId', () => {
  it('должен генерировать строку', () => {
    const randomId = generateRandomId();

    expect(typeof randomId).toBe('string');
  });

  it('должен генерировать строку длиной 16 символов', () => {
    const randomId = generateRandomId();

    expect(randomId.length).toBe(16);
  });

  it('должен генерировать строку только из hex символов', () => {
    const randomId = generateRandomId();
    const hexPattern = /^[0-9a-f]+$/;

    expect(hexPattern.test(randomId)).toBe(true);
  });

  it('должен генерировать разные ID при каждом вызове', () => {
    const id1 = generateRandomId();
    const id2 = generateRandomId();
    const id3 = generateRandomId();

    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  it('должен генерировать уникальные ID в цикле', () => {
    const ids = new Set<string>();
    const iterations = 100;

    for (let index = 0; index < iterations; index++) {
      ids.add(generateRandomId());
    }

    expect(ids.size).toBe(iterations);
  });

  it('должен использовать crypto.getRandomValues', () => {
    const mockGetRandomValues = vi
      .spyOn(crypto, 'getRandomValues')
      .mockImplementation((array) => {
        const typedArray = array as Uint8Array;

        for (let index = 0; index < typedArray.length; index++) {
          typedArray[index] = index;
        }

        return array;
      });

    const randomId = generateRandomId();

    expect(mockGetRandomValues).toHaveBeenCalledOnce();
    expect(randomId).toBe('0001020304050607');

    mockGetRandomValues.mockRestore();
  });

  it('должен корректно обрабатывать нулевые байты', () => {
    const mockGetRandomValues = vi
      .spyOn(crypto, 'getRandomValues')
      .mockImplementation((array) => {
        const typedArray = array as Uint8Array;

        for (let index = 0; index < typedArray.length; index++) {
          typedArray[index] = 0;
        }

        return array;
      });

    const randomId = generateRandomId();

    expect(randomId).toBe('0000000000000000');
    expect(randomId.length).toBe(16);

    mockGetRandomValues.mockRestore();
  });

  it('должен корректно обрабатывать максимальные байты', () => {
    const mockGetRandomValues = vi
      .spyOn(crypto, 'getRandomValues')
      .mockImplementation((array) => {
        const typedArray = array as Uint8Array;

        for (let index = 0; index < typedArray.length; index++) {
          typedArray[index] = 255;
        }

        return array;
      });

    const randomId = generateRandomId();

    expect(randomId).toBe('ffffffffffffffff');
    expect(randomId.length).toBe(16);

    mockGetRandomValues.mockRestore();
  });

  it('должен добавлять ведущий ноль к однозначным hex числам', () => {
    const mockGetRandomValues = vi
      .spyOn(crypto, 'getRandomValues')
      .mockImplementation((array) => {
        const typedArray = array as Uint8Array;
        typedArray[0] = 5;
        typedArray[1] = 15;
        typedArray[2] = 255;
        typedArray[3] = 0;
        typedArray[4] = 1;
        typedArray[5] = 16;
        typedArray[6] = 128;
        typedArray[7] = 200;

        return array;
      });

    const randomId = generateRandomId();

    expect(randomId).toBe('050fff00011080c8');

    mockGetRandomValues.mockRestore();
  });
});
