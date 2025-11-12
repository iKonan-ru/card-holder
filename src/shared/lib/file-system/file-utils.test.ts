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
    const file = new File(['test'], 'test.cbk', {
      type: 'application/octet-stream',
    });

    const result = readFileAsText(file);

    expect(result).toBeInstanceOf(Promise);
  });

  it('должен принимать File объект с допустимым MIME-типом', () => {
    const file = new File(['test content'], 'test.cbk', {
      type: 'application/octet-stream',
    });

    expect(() => readFileAsText(file)).not.toThrow();
  });

  it('должен обрабатывать допустимые типы файлов', () => {
    const octetFile = new File(['data'], 'test.cbk', {
      type: 'application/octet-stream',
    });
    const jsonFile = new File(['{}'], 'test.json', {
      type: 'application/json',
    });

    expect(() => readFileAsText(octetFile)).not.toThrow();
    expect(() => readFileAsText(jsonFile)).not.toThrow();
  });

  it('должен отклонять файлы с недопустимым MIME-типом', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    await expect(readFileAsText(file)).rejects.toThrow(
      'Недопустимый тип файла'
    );
  });

  it('должен отклонять файлы больше 10 МБ', async () => {
    const largeContent = new Array(11 * 1024 * 1024).fill('x').join('');
    const file = new File([largeContent], 'large.cbk', {
      type: 'application/octet-stream',
    });

    await expect(readFileAsText(file)).rejects.toThrow('Файл слишком большой');
  });

  it('должен обрабатывать ошибку чтения файла', async () => {
    const file = new File(['test'], 'test.cbk', {
      type: 'application/octet-stream',
    });

    vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (
      this: FileReader
    ) {
      if (this.onerror) {
        const errorEvent = Object.create(ProgressEvent.prototype, {
          type: { value: 'error' },
          target: { value: this },
        });
        this.onerror(errorEvent);
      }
    });

    await expect(readFileAsText(file)).rejects.toThrow('Failed to read file');

    vi.restoreAllMocks();
  });

  it('должен обрабатывать ошибку когда результат null', async () => {
    const file = new File(['test'], 'test.cbk', {
      type: 'application/octet-stream',
    });

    vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (
      this: FileReader
    ) {
      if (this.onload) {
        Object.defineProperty(this, 'result', {
          value: null,
          writable: true,
        });
        const loadEvent = Object.create(ProgressEvent.prototype, {
          type: { value: 'load' },
          target: { value: this },
        });
        this.onload(loadEvent);
      }
    });

    await expect(readFileAsText(file)).rejects.toThrow(
      'Failed to read file as text'
    );

    vi.restoreAllMocks();
  });

  it('должен обрабатывать ошибку когда результат не строка', async () => {
    const file = new File(['test'], 'test.cbk', {
      type: 'application/octet-stream',
    });

    vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (
      this: FileReader
    ) {
      if (this.onload) {
        Object.defineProperty(this, 'result', {
          value: new ArrayBuffer(8),
          writable: true,
        });
        const loadEvent = Object.create(ProgressEvent.prototype, {
          type: { value: 'load' },
          target: { value: this },
        });
        this.onload(loadEvent);
      }
    });

    await expect(readFileAsText(file)).rejects.toThrow(
      'Failed to read file as text'
    );

    vi.restoreAllMocks();
  });
});
