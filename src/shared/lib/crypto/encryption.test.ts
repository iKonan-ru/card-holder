/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from 'vitest';
import {
  ERROR_DECRYPTION_FAILED,
  ERROR_ENCRYPTION_FAILED,
  FILE_FORMAT_VERSION,
} from './constants';
import { decryptData, encryptData } from './encryption';
import type { IEncryptedPayload } from './types';

describe('encryptData', () => {
  const testPassword = 'test-password-12345';
  const testData = JSON.stringify({ test: 'data', number: 123 });

  it('должен создавать зашифрованный payload с правильной структурой', async () => {
    const result = await encryptData(testData, testPassword);

    expect(result).toHaveProperty('version');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('salt');
    expect(result).toHaveProperty('iv');
    expect(result).toHaveProperty('encrypted');
  });

  it('должен использовать правильную версию формата', async () => {
    const result = await encryptData(testData, testPassword);

    expect(result.version).toBe(FILE_FORMAT_VERSION);
  });

  it('должен генерировать временную метку', async () => {
    const beforeTimestamp = Date.now();
    const result = await encryptData(testData, testPassword);
    const afterTimestamp = Date.now();

    expect(result.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
    expect(result.timestamp).toBeLessThanOrEqual(afterTimestamp);
  });

  it('должен создавать разные зашифрованные данные при каждом вызове', async () => {
    const result1 = await encryptData(testData, testPassword);
    const result2 = await encryptData(testData, testPassword);

    expect(result1.salt).not.toBe(result2.salt);
    expect(result1.iv).not.toBe(result2.iv);
    expect(result1.encrypted).not.toBe(result2.encrypted);
  });

  it('должен создавать base64 строки для соли, iv и зашифрованных данных', async () => {
    const result = await encryptData(testData, testPassword);
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

    expect(result.salt).toMatch(base64Regex);
    expect(result.iv).toMatch(base64Regex);
    expect(result.encrypted).toMatch(base64Regex);
  });

  it('должен обрабатывать пустые строки', async () => {
    const result = await encryptData('', testPassword);

    expect(result).toHaveProperty('encrypted');
    expect(result.encrypted).toBeTruthy();
  });

  it('должен обрабатывать специальные символы', async () => {
    const specialData = 'Test: 🔒 Special chars: \n\t"\'\\';
    const result = await encryptData(specialData, testPassword);

    expect(result).toHaveProperty('encrypted');
    expect(result.encrypted).toBeTruthy();
  });

  it('должен выбрасывать ошибку при сбое шифрования', async () => {
    const encryptSpy = vi
      .spyOn(crypto.subtle, 'encrypt')
      .mockRejectedValue(new Error('Encryption error'));

    await expect(encryptData(testData, testPassword)).rejects.toThrowError(
      ERROR_ENCRYPTION_FAILED
    );

    encryptSpy.mockRestore();
  });
});

describe('decryptData', () => {
  const testPassword = 'test-password-12345';
  const testData = JSON.stringify({ test: 'data', number: 123 });

  it('должен расшифровывать данные, зашифрованные с тем же паролем', async () => {
    const encrypted = await encryptData(testData, testPassword);
    const decrypted = await decryptData(encrypted, testPassword);

    expect(decrypted).toBe(testData);
  });

  it('должен расшифровывать пустую строку', async () => {
    const encrypted = await encryptData('', testPassword);
    const decrypted = await decryptData(encrypted, testPassword);

    expect(decrypted).toBe('');
  });

  it('должен расшифровывать строки со специальными символами', async () => {
    const specialData = 'Test: 🔒 Special chars: \n\t"\'\\';
    const encrypted = await encryptData(specialData, testPassword);
    const decrypted = await decryptData(encrypted, testPassword);

    expect(decrypted).toBe(specialData);
  });

  it('должен бросать ошибку при неверном пароле', async () => {
    const encrypted = await encryptData(testData, testPassword);

    await expect(decryptData(encrypted, 'wrong-password')).rejects.toThrowError(
      ERROR_DECRYPTION_FAILED
    );
  });

  it('должен бросать ошибку при поврежденной соли', async () => {
    const encrypted = await encryptData(testData, testPassword);
    const corrupted: IEncryptedPayload = {
      ...encrypted,
      salt: 'corrupted-base64',
    };

    await expect(decryptData(corrupted, testPassword)).rejects.toThrowError(
      ERROR_DECRYPTION_FAILED
    );
  });

  it('должен бросать ошибку при поврежденном iv', async () => {
    const encrypted = await encryptData(testData, testPassword);
    const corrupted: IEncryptedPayload = {
      ...encrypted,
      iv: 'corrupted-base64',
    };

    await expect(decryptData(corrupted, testPassword)).rejects.toThrowError(
      ERROR_DECRYPTION_FAILED
    );
  });

  it('должен бросать ошибку при поврежденных зашифрованных данных', async () => {
    const encrypted = await encryptData(testData, testPassword);
    const corrupted: IEncryptedPayload = {
      ...encrypted,
      encrypted: 'corrupted-encrypted-data',
    };

    await expect(decryptData(corrupted, testPassword)).rejects.toThrowError(
      ERROR_DECRYPTION_FAILED
    );
  });
});

describe('encryptData + decryptData интеграция', () => {
  it('должен корректно шифровать и расшифровывать JSON данные', async () => {
    const originalData = {
      cards: [
        { pan: '1234567890123456', name: 'Test Card' },
        { pan: '9876543210987654', name: 'Another Card' },
      ],
    };
    const jsonData = JSON.stringify(originalData);
    const password = 'integration-test-password';

    const encrypted = await encryptData(jsonData, password);
    const decrypted = await decryptData(encrypted, password);
    const parsedData = JSON.parse(decrypted);

    expect(parsedData).toEqual(originalData);
  });

  it('должен работать с разными длинами паролей', async () => {
    const data = 'test data';
    const passwords = [
      'short',
      'medium-length-password',
      'very-long-password-with-many-characters-12345',
    ];

    for (const password of passwords) {
      const encrypted = await encryptData(data, password);
      const decrypted = await decryptData(encrypted, password);

      expect(decrypted).toBe(data);
    }
  });

  it('должен работать с большими объемами данных', async () => {
    const largeData = JSON.stringify({
      items: Array.from({ length: 100 }, (_, index) => ({
        id: index,
        data: `item-${index}`,
        nested: { value: index * 2 },
      })),
    });
    const password = 'large-data-password';

    const encrypted = await encryptData(largeData, password);
    const decrypted = await decryptData(encrypted, password);

    expect(decrypted).toBe(largeData);
  });
});
