import {
  ENCRYPTION_ALGORITHM,
  ERROR_DECRYPTION_FAILED,
  ERROR_ENCRYPTION_FAILED,
  FILE_FORMAT_VERSION,
  IV_LENGTH,
} from './constants';
import { arrayBufferToBase64, base64ToArrayBuffer } from './encoding';
import { deriveKeyFromPassword, generateSalt } from './key-derivation';
import type { IValidatedEncryptedPayload } from './types';

export const encryptData = async (
  data: string,
  password: string,
): Promise<IValidatedEncryptedPayload> => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const salt = generateSalt();
    const key = await deriveKeyFromPassword(password, salt);

    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
      },
      key,
      dataBuffer,
    );

    return {
      version: FILE_FORMAT_VERSION,
      timestamp: Date.now(),
      salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
      iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
      encrypted: arrayBufferToBase64(encryptedBuffer),
    };
  } catch {
    throw new Error(ERROR_ENCRYPTION_FAILED);
  }
};

export const decryptData = async (
  payload: IValidatedEncryptedPayload,
  password: string,
): Promise<string> => {
  try {
    const salt = new Uint8Array(base64ToArrayBuffer(payload.salt));
    const iv = new Uint8Array(base64ToArrayBuffer(payload.iv));
    const encryptedData = base64ToArrayBuffer(payload.encrypted);

    const key = await deriveKeyFromPassword(password, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
      },
      key,
      encryptedData,
    );

    const decoder = new TextDecoder();

    return decoder.decode(decryptedBuffer);
  } catch {
    throw new Error(ERROR_DECRYPTION_FAILED);
  }
};
