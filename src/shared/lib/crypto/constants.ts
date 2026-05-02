export const MASTER_KEY_SALT_STORAGE_KEY = 'card-holder-mk-salt';
export const PASSWORD_VERIFY_STORAGE_KEY = 'card-holder-mk-verify';
export const VERIFY_PLAINTEXT = 'card-holder-verified';

export const ENCRYPTION_ALGORITHM = 'AES-GCM';
export const PBKDF2_ALGORITHM = 'PBKDF2';
export const PBKDF2_HASH = 'SHA-256';

export const KEY_LENGTH = 256;
export const PBKDF2_ITERATIONS = 600000;
export const SALT_LENGTH = 16;
export const IV_LENGTH = 12;
export const FILE_FORMAT_VERSION = 1;

export const ERROR_ENCRYPTION_FAILED = 'Не удалось зашифровать данные';
export const ERROR_DECRYPTION_FAILED = 'Ошибка при расшифровке данных';
export const ERROR_WRONG_MASTER_PASSWORD = 'Неверный пароль';

export const ERROR_RATE_LIMIT_LOCKOUT = (minutes: number): string =>
  `Слишком много неудачных попыток. Попробуйте через ${minutes} мин.`;

export const DELAY_BASE_MS = 1000;
export const DELAY_MULTIPLIER = 2;
export const MAX_ATTEMPTS_BEFORE_DELAY = 3;
export const MAX_ATTEMPTS_BEFORE_LOCKOUT = 10;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export const STORAGE_KEY_ATTEMPTS = 'rateLimit_failedAttempts';
export const STORAGE_KEY_LOCKOUT = 'rateLimit_lockoutUntil';
