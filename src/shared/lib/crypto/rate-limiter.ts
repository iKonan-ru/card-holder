const DELAY_BASE_MS = 1000;
const DELAY_MULTIPLIER = 2;
const MAX_ATTEMPTS_BEFORE_DELAY = 3;
const MAX_ATTEMPTS_BEFORE_LOCKOUT = 10;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

let failedAttempts = 0;
let lockoutUntil: number | null = null;

export const resetFailedAttempts = (): void => {
  failedAttempts = 0;
  lockoutUntil = null;
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
    const errorMessage = `Слишком много неудачных попыток. Попробуйте через ${remainingMinutes} мин.`;

    throw new Error(errorMessage);
  }

  const delay = calculateDelay(failedAttempts);
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
