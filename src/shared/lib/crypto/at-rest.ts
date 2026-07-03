import type { IBankCard } from '@entities/bank-card';
import { ENCRYPTION_ALGORITHM, IV_LENGTH } from './constants';
import { arrayBufferToBase64, base64ToUint8Array } from './encoding';

export interface IStoredEncryptedCard {
  id: string;
  order: number;
  encryptedPayload: string;
}

export const encryptCardFields = async (
  card: IBankCard,
  key: CryptoKey,
): Promise<IStoredEncryptedCard> => {
  const { id, order, ...rest } = card;
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(rest));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    data,
  );

  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);

  return {
    id,
    order,
    encryptedPayload: arrayBufferToBase64(combined.buffer as ArrayBuffer),
  };
};

export const decryptCardFields = async (
  record: IStoredEncryptedCard,
  key: CryptoKey,
): Promise<IBankCard> => {
  const combined = base64ToUint8Array(record.encryptedPayload);
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();
  const rest: Omit<IBankCard, 'id' | 'order'> = JSON.parse(
    decoder.decode(decrypted),
  );

  return {
    id: record.id,
    order: record.order,
    ...rest,
  };
};

export interface IStoredEncryptedRecord {
  id: string;
  encryptedPayload: string;
}

export const encryptRecordFields = async <T extends { id: string }>(
  record: T,
  key: CryptoKey,
): Promise<IStoredEncryptedRecord> => {
  const { id, ...rest } = record;
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(rest));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    data,
  );

  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);

  return {
    id,
    encryptedPayload: arrayBufferToBase64(combined.buffer as ArrayBuffer),
  };
};

export const decryptRecordFields = async <T extends { id: string }>(
  record: IStoredEncryptedRecord,
  key: CryptoKey,
): Promise<T> => {
  const combined = base64ToUint8Array(record.encryptedPayload);
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();
  const rest = JSON.parse(decoder.decode(decrypted)) as Omit<T, 'id'>;

  return { id: record.id, ...rest } as T;
};
