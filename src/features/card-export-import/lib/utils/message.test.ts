import { describe, it, expect } from 'vitest';
import { createImportSuccessMessage } from './message';
import type { IImportResult } from '../../model';

describe('createImportSuccessMessage', () => {
  it('должен создавать сообщение с правильными числами', () => {
    const stats: IImportResult = {
      imported: 5,
      replaced: 3,
      total: 8,
    };

    const message = createImportSuccessMessage(stats);

    expect(message).toContain('5');
    expect(message).toContain('3');
  });

  it('должен обрабатывать нулевые значения', () => {
    const stats: IImportResult = {
      imported: 0,
      replaced: 0,
      total: 0,
    };

    const message = createImportSuccessMessage(stats);

    expect(message).toContain('0');
  });

  it('должен обрабатывать только импорт', () => {
    const stats: IImportResult = {
      imported: 10,
      replaced: 0,
      total: 10,
    };

    const message = createImportSuccessMessage(stats);

    expect(message).toContain('10');
    expect(message).toContain('0');
  });

  it('должен обрабатывать только замену', () => {
    const stats: IImportResult = {
      imported: 0,
      replaced: 7,
      total: 7,
    };

    const message = createImportSuccessMessage(stats);

    expect(message).toContain('0');
    expect(message).toContain('7');
  });

  it('должен возвращать строку', () => {
    const stats: IImportResult = {
      imported: 1,
      replaced: 2,
      total: 3,
    };

    const message = createImportSuccessMessage(stats);

    expect(typeof message).toBe('string');
    expect(message.length).toBeGreaterThan(0);
  });
});
