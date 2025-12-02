import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadFile } from './download-file';

describe('downloadFile', () => {
  let mockLink: HTMLAnchorElement;
  let createElementSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.fn>;
  let removeChildSpy: ReturnType<typeof vi.fn>;
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      style: { display: '' },
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(mockLink);
    appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => mockLink);
    removeChildSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => mockLink);
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен создавать ссылку для скачивания', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const fileName = 'test-file.txt';

    downloadFile(blob, fileName);

    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('должен устанавливать правильные атрибуты ссылки', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const fileName = 'test-file.txt';

    downloadFile(blob, fileName);

    expect(mockLink.href).toBe('blob:mock-url');
    expect(mockLink.download).toBe(fileName);
    expect(mockLink.style.display).toBe('none');
  });

  it('должен добавлять ссылку в DOM', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const fileName = 'test-file.txt';

    downloadFile(blob, fileName);

    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it('должен кликать по ссылке', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const fileName = 'test-file.txt';

    downloadFile(blob, fileName);

    expect(mockLink.click).toHaveBeenCalled();
  });

  it('должен удалять ссылку из DOM после клика', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const fileName = 'test-file.txt';

    downloadFile(blob, fileName);

    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it('должен освобождать URL после использования', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const fileName = 'test-file.txt';

    downloadFile(blob, fileName);

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('должен создавать объект URL из blob', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const fileName = 'test-file.txt';

    downloadFile(blob, fileName);

    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
  });

  it('должен обрабатывать разные имена файлов', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const fileNames = [
      'simple.txt',
      'with-dashes.json',
      'card-holder-export-2025-11-09.cbk',
    ];

    for (const fileName of fileNames) {
      vi.clearAllMocks();
      downloadFile(blob, fileName);

      expect(mockLink.download).toBe(fileName);
    }
  });

  it('должен обрабатывать разные типы blob', () => {
    const blobs = [
      new Blob(['text'], { type: 'text/plain' }),
      new Blob([JSON.stringify({ data: 'test' })], {
        type: 'application/json',
      }),
      new Blob(['binary data'], { type: 'application/octet-stream' }),
    ];

    for (const blob of blobs) {
      vi.clearAllMocks();
      downloadFile(blob, 'test-file');

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
    }
  });
});
