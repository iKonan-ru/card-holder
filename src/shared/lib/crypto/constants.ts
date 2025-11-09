export const ENCRYPTION_ALGORITHM = 'AES-GCM';
export const PBKDF2_ALGORITHM = 'PBKDF2';
export const PBKDF2_HASH = 'SHA-256';

export const KEY_LENGTH = 256;
export const PBKDF2_ITERATIONS = 100000;
export const SALT_LENGTH = 16;
export const IV_LENGTH = 12;
export const FILE_FORMAT_VERSION = 1;

export const ERROR_ENCRYPTION_FAILED = 'Не удалось зашифровать данные';
export const ERROR_DECRYPTION_FAILED = 'Ошибка при расшифровке данных';
