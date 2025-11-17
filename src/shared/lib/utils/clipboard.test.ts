import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from './clipboard';
import { ERROR_FAILED_TO_COPY } from '@shared/lib';

describe('copyToClipboard', () => {
  let mockWriteText: ReturnType<typeof vi.fn>;
  let originalNavigator: typeof navigator;
  let originalExecCommand: Document['execCommand'];

  beforeEach(() => {
    mockWriteText = vi.fn();
    originalNavigator = global.navigator;
    originalExecCommand = document.execCommand;
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    document.execCommand = originalExecCommand;
  });

  it('должен использовать navigator.clipboard.writeText если доступен', async () => {
    mockWriteText.mockResolvedValue(undefined);

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
      configurable: true,
    });

    await copyToClipboard('test text');

    expect(mockWriteText).toHaveBeenCalledOnce();
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('должен использовать fallback если clipboard API недоступен', async () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: undefined,
        userAgent: originalNavigator.userAgent || 'test-agent',
      },
      writable: true,
      configurable: true,
    });

    document.execCommand = vi
      .fn()
      .mockReturnValue(true) as unknown as Document['execCommand'];

    await copyToClipboard('fallback text');

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('должен использовать fallback если writeText выбрасывает ошибку', async () => {
    mockWriteText.mockRejectedValue(new Error('Clipboard denied'));

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: {
          writeText: mockWriteText,
        },
        userAgent: originalNavigator.userAgent || 'test-agent',
      },
      writable: true,
      configurable: true,
    });

    document.execCommand = vi
      .fn()
      .mockReturnValue(true) as unknown as Document['execCommand'];

    await copyToClipboard('test text');

    expect(mockWriteText).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('должен выбрасывать ошибку если оба метода не работают', async () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: undefined,
        userAgent: originalNavigator.userAgent || 'test-agent',
      },
      writable: true,
      configurable: true,
    });

    document.execCommand = vi
      .fn()
      .mockReturnValue(false) as unknown as Document['execCommand'];

    await expect(copyToClipboard('test')).rejects.toThrow(ERROR_FAILED_TO_COPY);
  });

  it('должен выбрасывать ошибку если clipboard API падает и fallback не работает', async () => {
    mockWriteText.mockRejectedValue(new Error('Access denied'));

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: {
          writeText: mockWriteText,
        },
        userAgent: originalNavigator.userAgent || 'test-agent',
      },
      writable: true,
      configurable: true,
    });

    document.execCommand = vi
      .fn()
      .mockReturnValue(false) as unknown as Document['execCommand'];

    await expect(copyToClipboard('test')).rejects.toThrow(ERROR_FAILED_TO_COPY);
  });

  it('должен корректно работать с пустой строкой', async () => {
    mockWriteText.mockResolvedValue(undefined);

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
      configurable: true,
    });

    await copyToClipboard('');

    expect(mockWriteText).toHaveBeenCalledWith('');
  });

  it('должен корректно работать со специальными символами', async () => {
    const specialText = '1234 5678 9012 3456\n123\t"test"';

    mockWriteText.mockResolvedValue(undefined);

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
      configurable: true,
    });

    await copyToClipboard(specialText);

    expect(mockWriteText).toHaveBeenCalledWith(specialText);
  });

  it('должен корректно работать с длинным текстом', async () => {
    const longText = 'a'.repeat(10000);

    mockWriteText.mockResolvedValue(undefined);

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
      configurable: true,
    });

    await copyToClipboard(longText);

    expect(mockWriteText).toHaveBeenCalledWith(longText);
  });

  it('должен использовать специальную логику для iOS устройств', async () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: undefined,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      },
      writable: true,
      configurable: true,
    });

    const mockCreateRange = vi.fn().mockReturnValue({
      selectNodeContents: vi.fn(),
    });

    const mockGetSelection = vi.fn().mockReturnValue({
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    });

    document.createRange = mockCreateRange;
    window.getSelection = mockGetSelection;
    document.execCommand = vi
      .fn()
      .mockReturnValue(true) as unknown as Document['execCommand'];

    await copyToClipboard('iOS test');

    expect(mockCreateRange).toHaveBeenCalled();
    expect(mockGetSelection).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('должен обрабатывать ошибку при вызове execCommand', async () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: undefined,
        userAgent: originalNavigator.userAgent || 'test-agent',
      },
      writable: true,
      configurable: true,
    });

    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error('execCommand error');
    }) as unknown as Document['execCommand'];

    await expect(copyToClipboard('test')).rejects.toThrow(ERROR_FAILED_TO_COPY);
  });
});
