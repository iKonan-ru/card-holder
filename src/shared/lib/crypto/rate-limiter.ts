import { INITIAL_ZERO, INITIAL_NULL } from '../constants/constants';

const DELAY_BASE_MS = 1000;
const DELAY_MULTIPLIER = 2;
const MAX_ATTEMPTS_BEFORE_DELAY = 3;
const MAX_ATTEMPTS_BEFORE_LOCKOUT = 10;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

let failedAttempts = INITIAL_ZERO;
let lockoutUntil: number | null = INITIAL_NULL;

export const resetFailedAttempts = (): void => {
  failedAttempts = INITIAL_ZERO;
  lockoutUntil = INITIAL_NULL;
};

export const incrementFailedAttempts = (): void => {
  failedAttempts++;

  const shouldLockout = failedAttempts >= MAX_ATTEMPTS_BEFORE_LOCKOUT;

  if (shouldLockout) {
    lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
};

export const getFailedAttempts = (): number => {
  return failedAttempts;
};

export const getLockoutUntil = (): number | null => {
  return lockoutUntil;
};

export const checkIsLockedOut = (): boolean => {
  if (lockoutUntil === INITIAL_NULL) {
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
  if (lockoutUntil === INITIAL_NULL) {
    return INITIAL_ZERO;
  }

  const now = Date.now();
  const remaining = lockoutUntil - now;

  return Math.max(INITIAL_ZERO, remaining);
};

const calculateDelay = (attempts: number): number => {
  const shouldApplyDelay = attempts > MAX_ATTEMPTS_BEFORE_DELAY;

  if (!shouldApplyDelay) {
    return INITIAL_ZERO;
  }

  const attemptsOverThreshold = attempts - MAX_ATTEMPTS_BEFORE_DELAY;
  const exponentialDelay =
    DELAY_BASE_MS * Math.pow(DELAY_MULTIPLIER, attemptsOverThreshold);

  return exponentialDelay;
};

export const applyRateLimit = async (): Promise<void> => {
  const isLocked = checkIsLockedOut();

  if (isLocked) {
    const remainingTime = getRemainingLockoutTime();
    const remainingMinutes = Math.ceil(remainingTime / 60000);
    const errorMessage = `Слишком много неудачных попыток. Попробуйте через ${remainingMinutes} мин.`;

    throw new Error(errorMessage);
  }

  const delay = calculateDelay(failedAttempts);
  const hasDelay = delay > INITIAL_ZERO;

  if (hasDelay) {
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
};

export const withRateLimit = async <T>(
  operation: () => Promise<T>
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
