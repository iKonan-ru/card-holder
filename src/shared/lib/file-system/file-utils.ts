import type { IEncryptedPayload } from '../crypto';
import { FILE_NAME_PREFIX, FILE_EXTENSION, FILE_MIME_TYPE } from './constants';

const TWO_DIGIT_PADDING = 2;
const ZERO_PAD_STRING = '0';

export const generateExportFileName = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(
    TWO_DIGIT_PADDING,
    ZERO_PAD_STRING
  );
  const day = String(now.getDate()).padStart(
    TWO_DIGIT_PADDING,
    ZERO_PAD_STRING
  );
  const hours = String(now.getHours()).padStart(
    TWO_DIGIT_PADDING,
    ZERO_PAD_STRING
  );
  const minutes = String(now.getMinutes()).padStart(
    TWO_DIGIT_PADDING,
    ZERO_PAD_STRING
  );
  const seconds = String(now.getSeconds()).padStart(
    TWO_DIGIT_PADDING,
    ZERO_PAD_STRING
  );

  const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

  return `${FILE_NAME_PREFIX}-${timestamp}${FILE_EXTENSION}`;
};

export const createBlobFromPayload = (payload: IEncryptedPayload): Blob => {
  const jsonString = JSON.stringify(payload);

  return new Blob([jsonString], { type: FILE_MIME_TYPE });
};

export const readFileAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        resolve(result);

        return;
      }

      reject(new Error('Failed to read file as text'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};
