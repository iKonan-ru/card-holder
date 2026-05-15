import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkSecureProtocol, logError } from '@shared/lib';

vi.mock('../utils/logger', () => ({
  logError: vi.fn(),
}));

describe('checkSecureProtocol', () => {
  const originalLocation = window.location;
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('не должен выводить предупреждение для HTTPS', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'https:',
        hostname: 'example.com',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).not.toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('не должен выводить предупреждение для localhost', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        hostname: 'localhost',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).not.toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('не должен выводить предупреждение для 127.0.0.1', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        hostname: '127.0.0.1',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).not.toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('должен выводить предупреждение для HTTP на не-localhost', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        hostname: 'example.com',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith({
      message:
        'ВНИМАНИЕ: Приложение работает по незащищенному соединению! Для безопасности используйте HTTPS.',
      context: 'SecurityCheck',
      level: 'warn',
    });

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('должен выводить предупреждение для HTTP на произвольном домене', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        hostname: 'mydomain.ru',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).toHaveBeenCalledOnce();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('должен выводить предупреждение для HTTP на IP адресе (не 127.0.0.1)', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        hostname: '192.168.1.1',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).toHaveBeenCalledOnce();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('не должен выводить предупреждение для HTTPS на localhost', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'https:',
        hostname: 'localhost',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).not.toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('не должен выводить предупреждение для HTTPS на 127.0.0.1', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'https:',
        hostname: '127.0.0.1',
      },
      writable: true,
      configurable: true,
    });

    checkSecureProtocol();

    expect(logError).not.toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });
});
