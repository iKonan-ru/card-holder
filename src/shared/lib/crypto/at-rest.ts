import type { IBankCard } from '@entities/bank-card';
import { ENCRYPTION_ALGORITHM, IV_LENGTH } from './constants';

export interface IStoredEncryptedCard {
  pan: string;
  order: number;
  encryptedPayload: string;
}

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const length = bytes.length;

  for (let index = 0; index < length; index++) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary);
};

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

export const encryptCardFields = async (
  card: IBankCard,
  key: CryptoKey,
): Promise<IStoredEncryptedCard> => {
  const { pan, order, ...rest } = card;
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
    pan,
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
  const rest = JSON.parse(decoder.decode(decrypted)) as Omit<
    IBankCard,
    'pan' | 'order'
  >;

  return {
    pan: record.pan,
    order: record.order,
    ...rest,
  };
};
