import { ENCRYPTION_ALGORITHM, IV_LENGTH } from './constants';
import { arrayBufferToBase64, base64ToUint8Array } from './encoding';

export const encryptWithIv = async (
  plaintext: string,
  key: CryptoKey,
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    data,
  );

  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);

  return arrayBufferToBase64(combined.buffer as ArrayBuffer);
};

export const decryptWithIv = async (
  combinedBase64: string,
  key: CryptoKey,
): Promise<string> => {
  const combined = base64ToUint8Array(combinedBase64);
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();

  return decoder.decode(decrypted);
};
