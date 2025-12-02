import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyRateLimit,
  checkIsLockedOut,
  getFailedAttempts,
  getLockoutUntil,
  getRemainingLockoutTime,
  incrementFailedAttempts,
  resetFailedAttempts,
  withRateLimit,
} from './rate-limiter';

describe('rate-limiter', () => {
  beforeEach(() => {
    resetFailedAttempts();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetFailedAttempts();
  });

  describe('resetFailedAttempts', () => {
    it('должен сбрасывать счетчик попыток в 0', () => {
      incrementFailedAttempts();
      incrementFailedAttempts();

      expect(getFailedAttempts()).toBe(2);

      resetFailedAttempts();

      expect(getFailedAttempts()).toBe(0);
    });

    it('должен сбрасывать lockout', () => {
      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      expect(getLockoutUntil()).not.toBeNull();

      resetFailedAttempts();

      expect(getLockoutUntil()).toBeNull();
    });
  });

  describe('incrementFailedAttempts', () => {
    it('должен увеличивать счетчик попыток на 1', () => {
      expect(getFailedAttempts()).toBe(0);

      incrementFailedAttempts();

      expect(getFailedAttempts()).toBe(1);

      incrementFailedAttempts();

      expect(getFailedAttempts()).toBe(2);
    });

    it('должен работать с множественными инкрементами', () => {
      incrementFailedAttempts();
      incrementFailedAttempts();
      incrementFailedAttempts();

      expect(getFailedAttempts()).toBe(3);
    });
  });

  describe('getFailedAttempts', () => {
    it('должен возвращать текущее количество неудачных попыток', () => {
      expect(getFailedAttempts()).toBe(0);

      incrementFailedAttempts();

      expect(getFailedAttempts()).toBe(1);
    });
  });

  describe('getLockoutUntil', () => {
    it('должен возвращать null если блокировки нет', () => {
      expect(getLockoutUntil()).toBeNull();
    });

    it('должен возвращать timestamp блокировки после 10 попыток', () => {
      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      const lockoutTime = getLockoutUntil();

      expect(lockoutTime).not.toBeNull();
      expect(lockoutTime).toBeGreaterThan(Date.now());
    });
  });

  describe('checkIsLockedOut', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('должен возвращать false если попыток меньше 10', () => {
      incrementFailedAttempts();

      expect(checkIsLockedOut()).toBe(false);
    });

    it('должен возвращать true после 10 неудачных попыток', () => {
      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      expect(checkIsLockedOut()).toBe(true);
    });

    it('должен возвращать false после истечения времени блокировки', () => {
      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      expect(checkIsLockedOut()).toBe(true);

      vi.advanceTimersByTime(16 * 60 * 1000);

      expect(checkIsLockedOut()).toBe(false);
    });

    it('должен сбрасывать счетчик после истечения блокировки', () => {
      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      expect(getFailedAttempts()).toBe(10);

      vi.advanceTimersByTime(16 * 60 * 1000);

      checkIsLockedOut();

      expect(getFailedAttempts()).toBe(0);
    });
  });

  describe('getRemainingLockoutTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('должен возвращать 0 если блокировки нет', () => {
      expect(getRemainingLockoutTime()).toBe(0);
    });

    it('должен возвращать оставшееся время блокировки', () => {
      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      const remaining = getRemainingLockoutTime();

      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(15 * 60 * 1000);
    });

    it('должен уменьшаться со временем', () => {
      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      const initial = getRemainingLockoutTime();

      vi.advanceTimersByTime(5 * 60 * 1000);

      const after5min = getRemainingLockoutTime();

      expect(after5min).toBeLessThan(initial);
      expect(after5min).toBeGreaterThan(0);
    });
  });

  describe('applyRateLimit', () => {
    it('не должен применять задержку для первых 3 попыток', async () => {
      resetFailedAttempts();
      incrementFailedAttempts();
      incrementFailedAttempts();
      incrementFailedAttempts();

      const startTime = Date.now();
      await applyRateLimit();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('должен применять задержку для 4-й попытки', async () => {
      resetFailedAttempts();
      incrementFailedAttempts();
      incrementFailedAttempts();
      incrementFailedAttempts();
      incrementFailedAttempts();

      const startTime = Date.now();
      await applyRateLimit();
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
    });

    it('должен применять задержку для 5-й попытки', async () => {
      resetFailedAttempts();

      for (let index = 0; index < 5; index++) {
        incrementFailedAttempts();
      }

      const startTime = Date.now();
      await applyRateLimit();
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(2000);
    });

    it('должен применять экспоненциальную задержку для 6-й попытки', async () => {
      resetFailedAttempts();

      for (let index = 0; index < 6; index++) {
        incrementFailedAttempts();
      }

      const startTime = Date.now();
      await applyRateLimit();
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(4000);
    }, 10000);

    it('должен выбрасывать ошибку при блокировке после 10 попыток', async () => {
      resetFailedAttempts();

      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      await expect(applyRateLimit()).rejects.toThrow(/Слишком много/);
    });

    it('должен показывать оставшееся время в сообщении об ошибке', async () => {
      resetFailedAttempts();

      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      await expect(applyRateLimit()).rejects.toThrow(/через \d+ мин/);
    });
  });

  describe('withRateLimit', () => {
    it('должен выполнить операцию успешно и сбросить счетчик', async () => {
      incrementFailedAttempts();
      incrementFailedAttempts();

      const mockOperation = vi.fn().mockResolvedValue('success');

      const result = await withRateLimit(mockOperation);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledOnce();
      expect(getFailedAttempts()).toBe(0);
    });

    it('должен увеличить счетчик при ошибке', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('test error'));

      await expect(withRateLimit(mockOperation)).rejects.toThrow('test error');

      expect(getFailedAttempts()).toBe(1);
    });

    it('должен применять задержку перед повторной попыткой', async () => {
      for (let index = 0; index < 4; index++) {
        incrementFailedAttempts();
      }

      const mockOperation = vi.fn().mockResolvedValue('success');

      const startTime = Date.now();
      await withRateLimit(mockOperation);
      const endTime = Date.now();

      expect(mockOperation).toHaveBeenCalledOnce();
      expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
    });

    it('должен работать с несколькими последовательными неудачными попытками', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('error'));

      await expect(withRateLimit(mockOperation)).rejects.toThrow('error');

      expect(getFailedAttempts()).toBe(1);

      await expect(withRateLimit(mockOperation)).rejects.toThrow('error');

      expect(getFailedAttempts()).toBe(2);
    });

    it('должен сбросить счетчик после успешной операции', async () => {
      incrementFailedAttempts();
      incrementFailedAttempts();
      incrementFailedAttempts();

      expect(getFailedAttempts()).toBe(3);

      const mockOperation = vi.fn().mockResolvedValue('success');

      await withRateLimit(mockOperation);

      expect(getFailedAttempts()).toBe(0);
    });

    it('должен пробрасывать результат операции', async () => {
      const expectedResult = { data: 'test', value: 42 };
      const mockOperation = vi.fn().mockResolvedValue(expectedResult);

      const result = await withRateLimit(mockOperation);

      expect(result).toEqual(expectedResult);
    });

    it('должен блокировать операцию после 10 неудачных попыток', async () => {
      resetFailedAttempts();

      for (let index = 0; index < 10; index++) {
        incrementFailedAttempts();
      }

      const mockOperation = vi.fn().mockResolvedValue('success');

      await expect(withRateLimit(mockOperation)).rejects.toThrow(
        /Слишком много/
      );

      expect(mockOperation).not.toHaveBeenCalled();
    });

    it('должен устанавливать lockout при достижении лимита', () => {
      resetFailedAttempts();

      for (let index = 0; index < 9; index++) {
        incrementFailedAttempts();
      }

      expect(getLockoutUntil()).toBeNull();

      incrementFailedAttempts();

      expect(getLockoutUntil()).not.toBeNull();
      expect(getFailedAttempts()).toBe(10);
    });
  });
});
