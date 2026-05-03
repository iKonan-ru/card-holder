import {
  ENCRYPTION_ALGORITHM,
  IV_LENGTH,
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
  const encoder = new TextEncoder();
  const data = encoder.encode(VERIFY_PLAINTEXT);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    data,
  );

  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);

  localStorage.setItem(
    PASSWORD_VERIFY_STORAGE_KEY,
    arrayBufferToBase64(combined.buffer as ArrayBuffer),
  );
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
    const combined = base64ToUint8Array(stored);
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key,
      ciphertext,
    );

    const decoder = new TextDecoder();

    return decoder.decode(decrypted) === VERIFY_PLAINTEXT;
  } catch {
    return false;
  }
};
