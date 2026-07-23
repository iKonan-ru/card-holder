import { decryptWithIv, encryptWithIv } from './aes-gcm';
import {
  MASTER_KEY_SALT_STORAGE_KEY,
  PASSWORD_VERIFY_STORAGE_KEY,
  VERIFY_PLAINTEXT,
} from './constants';
import { arrayBufferToBase64, base64ToUint8Array } from './encoding';
import { deriveKeyFromPassword } from './key-derivation';

export const loadOrCreateSalt = (): { salt: Uint8Array; isNew: boolean } => {
  const stored = localStorage.getItem(MASTER_KEY_SALT_STORAGE_KEY);

  if (stored) {
    return { salt: base64ToUint8Array(stored), isNew: false };
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));

  localStorage.setItem(
    MASTER_KEY_SALT_STORAGE_KEY,
    arrayBufferToBase64(salt.buffer as ArrayBuffer),
  );

  return { salt, isNew: true };
};

export const saveVerificationToken = async (key: CryptoKey): Promise<void> => {
  const combined = await encryptWithIv(VERIFY_PLAINTEXT, key);

  localStorage.setItem(PASSWORD_VERIFY_STORAGE_KEY, combined);
};

export const verifyMasterPassword = async (
  password: string,
): Promise<boolean> => {
  const stored = localStorage.getItem(PASSWORD_VERIFY_STORAGE_KEY);

  if (!stored) {
    return false;
  }

  try {
    const { salt } = loadOrCreateSalt();
    const key = await deriveKeyFromPassword(password, salt);
    const decrypted = await decryptWithIv(stored, key);

    return decrypted === VERIFY_PLAINTEXT;
  } catch {
    return false;
  }
};
