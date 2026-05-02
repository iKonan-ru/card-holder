/**
 * @vitest-environment node
 */

import { beforeAll, describe, expect, it } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { decryptCardFields, encryptCardFields } from './at-rest';
import { deriveKeyFromPassword, generateSalt } from './key-derivation';

let sharedKey: CryptoKey;

beforeAll(async () => {
  sharedKey = await deriveKeyFromPassword('test-password', generateSalt());
});

const makeCard = (overrides?: Partial<IBankCard>): IBankCard => ({
  pan: '4111111111111111',
  expires: '12/26',
  name: 'John Doe',
  cvv: '123',
  order: 1,
  ...overrides,
});

describe('encryptCardFields', () => {
  it('должен сохранять pan и order в открытом виде', async () => {
    const card = makeCard();
    const result = await encryptCardFields(card, sharedKey);

    expect(result.pan).toBe(card.pan);
    expect(result.order).toBe(card.order);
  });

  it('должен создавать непустой encryptedPayload', async () => {
    const result = await encryptCardFields(makeCard(), sharedKey);

    expect(typeof result.encryptedPayload).toBe('string');
    expect(result.encryptedPayload.length).toBeGreaterThan(0);
  });

  it('encryptedPayload должен быть валидной строкой base64', async () => {
    const result = await encryptCardFields(makeCard(), sharedKey);

    expect(() => atob(result.encryptedPayload)).not.toThrow();
  });

  it('должен генерировать разный payload при каждом вызове (случайный IV)', async () => {
    const card = makeCard();
    const r1 = await encryptCardFields(card, sharedKey);
    const r2 = await encryptCardFields(card, sharedKey);

    expect(r1.encryptedPayload).not.toBe(r2.encryptedPayload);
  });

  it('не должен включать sensitive-поля в encryptedPayload в открытом виде', async () => {
    const card = makeCard({ cvv: '999', name: 'Secret Name' });
    const result = await encryptCardFields(card, sharedKey);

    expect(result.encryptedPayload).not.toContain('999');
    expect(result.encryptedPayload).not.toContain('Secret Name');
  });
});

describe('decryptCardFields', () => {
  it('должен восстановить исходную карту полностью', async () => {
    const card = makeCard();
    const encrypted = await encryptCardFields(card, sharedKey);
    const decrypted = await decryptCardFields(encrypted, sharedKey);

    expect(decrypted).toEqual(card);
  });

  it('должен сохранять необязательные поля (pin, phrase, address)', async () => {
    const card = makeCard({
      pin: '1234',
      phrase: 'my phrase',
      address: { city: 'Moscow', zip: '101000' },
    });
    const encrypted = await encryptCardFields(card, sharedKey);
    const decrypted = await decryptCardFields(encrypted, sharedKey);

    expect(decrypted.pin).toBe('1234');
    expect(decrypted.phrase).toBe('my phrase');
    expect(decrypted.address).toEqual({ city: 'Moscow', zip: '101000' });
  });

  it('должен выбросить ошибку при использовании другого ключа', async () => {
    const wrongKey = await deriveKeyFromPassword(
      'wrong-password',
      generateSalt(),
    );
    const encrypted = await encryptCardFields(makeCard(), sharedKey);

    await expect(decryptCardFields(encrypted, wrongKey)).rejects.toThrow();
  });

  it('должен выбросить ошибку при поврежденном encryptedPayload', async () => {
    const encrypted = await encryptCardFields(makeCard(), sharedKey);

    await expect(
      decryptCardFields(
        { ...encrypted, encryptedPayload: btoa('corrupted') },
        sharedKey,
      ),
    ).rejects.toThrow();
  });
});

describe('encryptCardFields + decryptCardFields round-trip', () => {
  it('должен корректно обрабатывать карты со спецсимволами в полях', async () => {
    const card = makeCard({ name: 'Иванов Иван "Test" & <More>' });
    const encrypted = await encryptCardFields(card, sharedKey);
    const decrypted = await decryptCardFields(encrypted, sharedKey);

    expect(decrypted.name).toBe(card.name);
  });
});
