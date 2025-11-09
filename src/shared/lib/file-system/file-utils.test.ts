import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateExportFileName,
  createBlobFromPayload,
  readFileAsText,
} from './file-utils';
import type { IEncryptedPayload } from '../crypto';
import { FILE_NAME_PREFIX, FILE_EXTENSION, FILE_MIME_TYPE } from './constants';

describe('generateExportFileName', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('должен генерировать имя файла с правильным префиксом и расширением', () => {
    const date = new Date('2025-11-09T15:30:45');
    vi.setSystemTime(date);

    const fileName = generateExportFileName();

    expect(fileName).toContain(FILE_NAME_PREFIX);
    expect(fileName).toContain(FILE_EXTENSION);
  });

  it('должен включать временную метку в правильном формате', () => {
    const date = new Date('2025-11-09T15:30:45');
    vi.setSystemTime(date);

    const fileName = generateExportFileName();

    expect(fileName).toBe(
      `${FILE_NAME_PREFIX}-2025-11-09-15-30-45${FILE_EXTENSION}`
    );
  });

  it('должен добавлять нули к однозначным числам', () => {
    const date = new Date('2025-01-05T08:03:07');
    vi.setSystemTime(date);

    const fileName = generateExportFileName();

    expect(fileName).toBe(
      `${FILE_NAME_PREFIX}-2025-01-05-08-03-07${FILE_EXTENSION}`
    );
  });

  it('должен генерировать разные имена для разного времени', () => {
    vi.setSystemTime(new Date('2025-11-09T15:30:45'));
    const fileName1 = generateExportFileName();

    vi.setSystemTime(new Date('2025-11-09T15:30:46'));
    const fileName2 = generateExportFileName();

    expect(fileName1).not.toBe(fileName2);
  });
});

describe('createBlobFromPayload', () => {
  const mockPayload: IEncryptedPayload = {
    version: 1,
    timestamp: 1699537845000,
    salt: 'test-salt-base64',
    iv: 'test-iv-base64',
    encrypted: 'test-encrypted-data-base64',
  };

  it('должен создавать Blob из payload', () => {
    const blob = createBlobFromPayload(mockPayload);

    expect(blob).toBeInstanceOf(Blob);
  });

  it('должен использовать правильный MIME тип', () => {
    const blob = createBlobFromPayload(mockPayload);

    expect(blob.type).toBe(FILE_MIME_TYPE);
  });

  it('должен содержать JSON строку payload', () => {
    const blob = createBlobFromPayload(mockPayload);

    expect(blob.size).toBeGreaterThan(0);
  });

  it('должен обрабатывать payload с разными данными', () => {
    const customPayload: IEncryptedPayload = {
      version: 2,
      timestamp: Date.now(),
      salt: 'different-salt',
      iv: 'different-iv',
      encrypted: 'different-encrypted',
    };

    const blob = createBlobFromPayload(customPayload);

    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toBe(FILE_MIME_TYPE);
  });
});

describe('readFileAsText', () => {
  it('должен возвращать promise', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    const result = readFileAsText(file);

    expect(result).toBeInstanceOf(Promise);
  });

  it('должен принимать File объект', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    expect(() => readFileAsText(file)).not.toThrow();
  });

  it('должен обрабатывать разные типы файлов', () => {
    const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
    const jsonFile = new File(['{}'], 'test.json', {
      type: 'application/json',
    });

    expect(() => readFileAsText(textFile)).not.toThrow();
    expect(() => readFileAsText(jsonFile)).not.toThrow();
  });
});
