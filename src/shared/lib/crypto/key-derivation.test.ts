/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import { ENCRYPTION_ALGORITHM, KEY_LENGTH, SALT_LENGTH } from './constants';
import { deriveKeyFromPassword, generateSalt } from './key-derivation';

describe('generateSalt', () => {
  it('должен генерировать соль правильной длины', () => {
    const salt = generateSalt();

    expect(salt).toBeInstanceOf(Uint8Array);
    expect(salt.length).toBe(SALT_LENGTH);
  });

  it('должен генерировать разные значения при каждом вызове', () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();

    expect(salt1).not.toEqual(salt2);
  });
});

describe('deriveKeyFromPassword', () => {
  it('должен создавать криптографический ключ из пароля', async () => {
    const password = 'test-password-123';
    const salt = generateSalt();

    const key = await deriveKeyFromPassword(password, salt);

    expect(key).toBeInstanceOf(CryptoKey);
    expect(key.type).toBe('secret');
    expect(key.algorithm).toMatchObject({
      name: ENCRYPTION_ALGORITHM,
      length: KEY_LENGTH,
    });
  });

  it('должен создавать одинаковые ключи для одинаковых паролей и соли', async () => {
    const password = 'same-password';
    const salt = generateSalt();

    const key1 = await deriveKeyFromPassword(password, salt);
    const key2 = await deriveKeyFromPassword(password, salt);

    const data = new TextEncoder().encode('test data');
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted1 = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key1,
      data,
    );
    const encrypted2 = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key2,
      data,
    );

    expect(new Uint8Array(encrypted1)).toEqual(new Uint8Array(encrypted2));
  });

  it('должен создавать разные ключи для разных паролей', async () => {
    const salt = generateSalt();
    const password1 = 'password-one';
    const password2 = 'password-two';

    const key1 = await deriveKeyFromPassword(password1, salt);
    const key2 = await deriveKeyFromPassword(password2, salt);

    const data = new TextEncoder().encode('test data');
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted1 = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key1,
      data,
    );
    const encrypted2 = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key2,
      data,
    );

    expect(new Uint8Array(encrypted1)).not.toEqual(new Uint8Array(encrypted2));
  });

  it('должен создавать разные ключи для разных солей', async () => {
    const password = 'same-password';
    const salt1 = generateSalt();
    const salt2 = generateSalt();

    const key1 = await deriveKeyFromPassword(password, salt1);
    const key2 = await deriveKeyFromPassword(password, salt2);

    const data = new TextEncoder().encode('test data');
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted1 = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key1,
      data,
    );
    const encrypted2 = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key2,
      data,
    );

    expect(new Uint8Array(encrypted1)).not.toEqual(new Uint8Array(encrypted2));
  });
});
