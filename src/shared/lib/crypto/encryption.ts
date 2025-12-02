import { EMPTY_STRING } from '../constants';
import {
  ENCRYPTION_ALGORITHM,
  ERROR_DECRYPTION_FAILED,
  ERROR_ENCRYPTION_FAILED,
  FILE_FORMAT_VERSION,
  IV_LENGTH,
} from './constants';
import { deriveKeyFromPassword, generateSalt } from './key-derivation';
import type { IEncryptedPayload } from './types';

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = EMPTY_STRING;
  const length = bytes.length;

  for (let index = 0; index < length; index++) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const length = binary.length;
  const bytes = new Uint8Array(length);

  for (let index = 0; index < length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
};

export const encryptData = async (
  data: string,
  password: string
): Promise<IEncryptedPayload> => {
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
      dataBuffer
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
  payload: IEncryptedPayload,
  password: string
): Promise<string> => {
  try {
    const salt = new Uint8Array(base64ToArrayBuffer(payload.salt!));
    const iv = new Uint8Array(base64ToArrayBuffer(payload.iv!));
    const encryptedData = base64ToArrayBuffer(payload.encrypted!);

    const key = await deriveKeyFromPassword(password, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
      },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();

    return decoder.decode(decryptedBuffer);
  } catch {
    throw new Error(ERROR_DECRYPTION_FAILED);
  }
};
