import { FILE_EXTENSION } from './constants';

interface ISaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
}

interface IOpenFilePickerOptions {
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
  multiple?: boolean;
}

declare global {
  interface Window {
    showSaveFilePicker?: (
      options?: ISaveFilePickerOptions
    ) => Promise<FileSystemFileHandle>;
    showOpenFilePicker?: (
      options?: IOpenFilePickerOptions
    ) => Promise<FileSystemFileHandle[]>;
  }
}

export const showSaveFilePicker = async (
  fileName: string
): Promise<FileSystemFileHandle> => {
  if (!window.showSaveFilePicker) {
    throw new Error('File System Access API не поддерживается');
  }

  const handle = await window.showSaveFilePicker({
    suggestedName: fileName,
    types: [
      {
        description: 'Card Holder Backup',
        accept: {
          'application/octet-stream': [FILE_EXTENSION],
        },
      },
    ],
  });

  return handle;
};

export const showOpenFilePicker = async (): Promise<File> => {
  if (!window.showOpenFilePicker) {
    throw new Error('File System Access API не поддерживается');
  }

  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Card Holder Backup',
        accept: {
          'application/octet-stream': [FILE_EXTENSION],
        },
      },
    ],
    multiple: false,
  });

  const file = await handle.getFile();

  return file;
};
