import { ERROR_RATE_LIMIT_LOCKOUT } from './constants';

const DELAY_BASE_MS = 1000;
const DELAY_MULTIPLIER = 2;
const MAX_ATTEMPTS_BEFORE_DELAY = 3;
const MAX_ATTEMPTS_BEFORE_LOCKOUT = 10;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

const STORAGE_KEY_ATTEMPTS = 'rateLimit_failedAttempts';
const STORAGE_KEY_LOCKOUT = 'rateLimit_lockoutUntil';

const getStoredAttempts = (): number => {
  const stored = sessionStorage.getItem(STORAGE_KEY_ATTEMPTS);

  return stored ? parseInt(stored, 10) : 0;
};

const getStoredLockout = (): number | null => {
  const stored = sessionStorage.getItem(STORAGE_KEY_LOCKOUT);

  return stored ? parseInt(stored, 10) : null;
};

export const resetFailedAttempts = (): void => {
  sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
  sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
};

export const incrementFailedAttempts = (): void => {
  const attempts = getStoredAttempts() + 1;
  sessionStorage.setItem(STORAGE_KEY_ATTEMPTS, String(attempts));

  const shouldLockout = attempts >= MAX_ATTEMPTS_BEFORE_LOCKOUT;

  if (shouldLockout) {
    sessionStorage.setItem(
      STORAGE_KEY_LOCKOUT,
      String(Date.now() + LOCKOUT_DURATION_MS),
    );
  }
};

export const getFailedAttempts = (): number => {
  return getStoredAttempts();
};

export const getLockoutUntil = (): number | null => {
  return getStoredLockout();
};

export const checkIsLockedOut = (): boolean => {
  const lockoutUntil = getStoredLockout();

  if (lockoutUntil === null) {
    return false;
  }

  const now = Date.now();
  const isStillLocked = now < lockoutUntil;

  if (!isStillLocked) {
    resetFailedAttempts();

    return false;
  }

  return true;
};

export const getRemainingLockoutTime = (): number => {
  const lockoutUntil = getStoredLockout();

  if (lockoutUntil === null) {
    return 0;
  }

  const now = Date.now();
  const remaining = lockoutUntil - now;

  return Math.max(0, remaining);
};

const calculateDelay = (attempts: number): number => {
  const shouldApplyDelay = attempts > MAX_ATTEMPTS_BEFORE_DELAY;

  if (!shouldApplyDelay) {
    return 0;
  }

  const attemptsOverThreshold = attempts - MAX_ATTEMPTS_BEFORE_DELAY;

  return DELAY_BASE_MS * Math.pow(DELAY_MULTIPLIER, attemptsOverThreshold);
};

export const applyRateLimit = async (): Promise<void> => {
  const isLocked = checkIsLockedOut();

  if (isLocked) {
    const remainingTime = getRemainingLockoutTime();
    const remainingMinutes = Math.ceil(remainingTime / 60000);

    throw new Error(ERROR_RATE_LIMIT_LOCKOUT(remainingMinutes));
  }

  const delay = calculateDelay(getStoredAttempts());
  const hasDelay = delay > 0;

  if (hasDelay) {
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
};

export const withRateLimit = async <T>(
  operation: () => Promise<T>,
): Promise<T> => {
  await applyRateLimit();

  try {
    const result = await operation();
    resetFailedAttempts();

    return result;
  } catch (error) {
    incrementFailedAttempts();

    throw error;
  }
};
