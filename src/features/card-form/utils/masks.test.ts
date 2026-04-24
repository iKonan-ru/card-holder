import { describe, expect, it } from 'vitest';
import {
  filterAlphanumeric,
  filterDigitsOnly,
  filterNoSpaces,
  formatExpires,
  formatName,
  formatPan,
} from './masks';

describe('formatPan', () => {
  it('должна форматировать номер карты с пробелами', () => {
    expect(formatPan('1234567812345678')).toBe('1234 5678 1234 5678');
  });

  it('должна форматировать частичный номер карты', () => {
    expect(formatPan('12345')).toBe('1234 5');
  });

  it('должна обрабатывать пустую строку', () => {
    expect(formatPan('')).toBe('');
  });

  it('должна игнорировать нецифровые символы', () => {
    expect(formatPan('1234abc5678')).toBe('1234 5678');
  });
});

describe('formatExpires', () => {
  it('должна форматировать дату истечения со слешем', () => {
    expect(formatExpires('1225')).toBe('12/25');
  });

  it('должна форматировать частичную дату', () => {
    expect(formatExpires('12')).toBe('12');
  });

  it('должна форматировать один символ', () => {
    expect(formatExpires('1')).toBe('1');
  });

  it('должна обрабатывать пустую строку', () => {
    expect(formatExpires('')).toBe('');
  });

  it('должна игнорировать нецифровые символы', () => {
    expect(formatExpires('12ab25')).toBe('12/25');
  });
});

describe('filterDigitsOnly', () => {
  it('должна оставлять только цифры', () => {
    expect(filterDigitsOnly('abc123def456')).toBe('123456');
  });

  it('должна обрабатывать только цифры', () => {
    expect(filterDigitsOnly('123456')).toBe('123456');
  });

  it('должна обрабатывать пустую строку', () => {
    expect(filterDigitsOnly('')).toBe('');
  });
});

describe('filterAlphanumeric', () => {
  it('должна оставлять только буквы и цифры', () => {
    expect(filterAlphanumeric('abc123!@#')).toBe('abc123');
  });

  it('должна оставлять кириллицу', () => {
    expect(filterAlphanumeric('Тест123')).toBe('Тест123');
  });

  it('должна удалять спецсимволы', () => {
    expect(filterAlphanumeric('test-123_abc')).toBe('test123abc');
  });

  it('должна обрабатывать пустую строку', () => {
    expect(filterAlphanumeric('')).toBe('');
  });
});

describe('filterNoSpaces', () => {
  it('должна удалять пробелы', () => {
    expect(filterNoSpaces('hello world')).toBe('helloworld');
  });

  it('должна удалять табуляции и переносы строк', () => {
    expect(filterNoSpaces('hello\tworld\nfoo')).toBe('helloworldfoo');
  });

  it('должна сохранять спецсимволы и цифры', () => {
    expect(filterNoSpaces('abc!@#123')).toBe('abc!@#123');
  });

  it('должна сохранять кириллицу', () => {
    expect(filterNoSpaces('Тест123!')).toBe('Тест123!');
  });

  it('должна обрабатывать строку из одних пробелов', () => {
    expect(filterNoSpaces('   ')).toBe('');
  });

  it('должна обрабатывать пустую строку', () => {
    expect(filterNoSpaces('')).toBe('');
  });
});

describe('formatName', () => {
  it('должна оставлять только латинские буквы и пробелы', () => {
    expect(formatName('John123 Doe!@#')).toBe('JOHN DOE');
  });

  it('должна удалять кириллицу', () => {
    expect(formatName('JohnИванDoe')).toBe('JOHNDOE');
  });

  it('должна приводить к верхнему регистру', () => {
    expect(formatName('john doe')).toBe('JOHN DOE');
  });

  it('должна удалять цифры и спецсимволы', () => {
    expect(formatName('John-123_Doe')).toBe('JOHNDOE');
  });

  it('должна сохранять пробелы', () => {
    expect(formatName('john   doe')).toBe('JOHN   DOE');
  });

  it('должна обрабатывать пустую строку', () => {
    expect(formatName('')).toBe('');
  });
});
