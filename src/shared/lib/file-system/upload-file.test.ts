import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FILE_SELECTION_CANCELLED_ERROR } from './constants';
import { uploadFile } from './upload-file';

describe('uploadFile', () => {
  let mockInput: HTMLInputElement;
  let createElementSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.fn>;
  let removeChildSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockInput = {
      type: '',
      accept: '',
      style: { display: '' },
      files: null,
      click: vi.fn(),
      onchange: null,
      oncancel: null,
      parentNode: document.body,
    } as unknown as HTMLInputElement;

    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(mockInput);
    appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => mockInput);
    removeChildSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => mockInput);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен создавать input элемент', () => {
    uploadFile('.txt');

    expect(createElementSpy).toHaveBeenCalledWith('input');
  });

  it('должен устанавливать правильные атрибуты input', () => {
    const accept = '.json,.cbk';

    uploadFile(accept);

    expect(mockInput.type).toBe('file');
    expect(mockInput.accept).toBe(accept);
    expect(mockInput.style.display).toBe('none');
  });

  it('должен добавлять input в DOM', () => {
    uploadFile('.txt');

    expect(appendChildSpy).toHaveBeenCalledWith(mockInput);
  });

  it('должен кликать по input для открытия диалога', () => {
    uploadFile('.txt');

    expect(mockInput.click).toHaveBeenCalled();
  });

  it('должен резолвить promise с выбранным файлом', async () => {
    const mockFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });

    const promise = uploadFile('.txt');

    Object.defineProperty(mockInput, 'files', {
      value: [mockFile],
      writable: true,
      configurable: true,
    });

    setTimeout(() => {
      if (mockInput.onchange) {
        mockInput.onchange(new Event('change'));
      }
    }, 0);

    const result = await promise;

    expect(result).toBe(mockFile);
  });

  it('должен удалять input из DOM после выбора файла', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = uploadFile('.txt');

    Object.defineProperty(mockInput, 'files', {
      value: [mockFile],
      writable: true,
      configurable: true,
    });

    setTimeout(() => {
      if (mockInput.onchange) {
        mockInput.onchange(new Event('change'));
      }
    }, 0);

    await promise;

    expect(removeChildSpy).toHaveBeenCalledWith(mockInput);
  });

  it('должен реджектить promise при отсутствии файла', async () => {
    const promise = uploadFile('.txt');

    Object.defineProperty(mockInput, 'files', {
      value: [],
      writable: true,
      configurable: true,
    });

    setTimeout(() => {
      if (mockInput.onchange) {
        mockInput.onchange(new Event('change'));
      }
    }, 0);

    await expect(promise).rejects.toThrowError(FILE_SELECTION_CANCELLED_ERROR);
  });

  it('должен реджектить promise при отмене выбора', async () => {
    const promise = uploadFile('.txt');

    setTimeout(() => {
      if (mockInput.oncancel) {
        mockInput.oncancel(new Event('cancel'));
      }
    }, 0);

    await expect(promise).rejects.toThrowError(FILE_SELECTION_CANCELLED_ERROR);
  });

  it('должен удалять input из DOM при отмене', async () => {
    const promise = uploadFile('.txt');

    setTimeout(() => {
      if (mockInput.oncancel) {
        mockInput.oncancel(new Event('cancel'));
      }
    }, 0);

    try {
      await promise;
    } catch {
      expect(removeChildSpy).toHaveBeenCalledWith(mockInput);
    }
  });

  it('должен обрабатывать разные типы файлов', async () => {
    const acceptTypes = ['.txt', '.json', '.cbk', 'image/*', '.txt,.json'];

    for (const accept of acceptTypes) {
      vi.clearAllMocks();
      uploadFile(accept);

      expect(mockInput.accept).toBe(accept);
    }
  });

  it('должен обрабатывать файлы разных размеров', async () => {
    const files = [
      new File(['small'], 'small.txt', { type: 'text/plain' }),
      new File(['x'.repeat(1000)], 'medium.txt', { type: 'text/plain' }),
    ];

    for (const file of files) {
      vi.clearAllMocks();
      const promise = uploadFile('.txt');

      Object.defineProperty(mockInput, 'files', {
        value: [file],
        writable: true,
        configurable: true,
      });

      setTimeout(() => {
        if (mockInput.onchange) {
          mockInput.onchange(new Event('change'));
        }
      }, 0);

      const result = await promise;

      expect(result).toBe(file);
    }
  });
});
