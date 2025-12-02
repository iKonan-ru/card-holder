import {
  ERROR_FAILED_TO_READ_FILE,
  ERROR_FAILED_TO_READ_FILE_AS_TEXT,
  ERROR_FILE_TOO_LARGE,
  ERROR_INVALID_FILE_TYPE,
  MONTH_OFFSET,
  TYPE_STRING,
  ZERO_CHAR,
} from '../constants';
import type { IEncryptedPayload } from '../crypto';
import {
  ALLOWED_MIME_TYPES,
  FILE_EXTENSION,
  FILE_MIME_TYPE,
  FILE_NAME_PREFIX,
  MAX_FILE_SIZE,
} from './constants';

const TWO_DIGIT_PADDING = 2;

export const generateExportFileName = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + MONTH_OFFSET).padStart(
    TWO_DIGIT_PADDING,
    ZERO_CHAR
  );
  const day = String(now.getDate()).padStart(TWO_DIGIT_PADDING, ZERO_CHAR);
  const hours = String(now.getHours()).padStart(TWO_DIGIT_PADDING, ZERO_CHAR);
  const minutes = String(now.getMinutes()).padStart(
    TWO_DIGIT_PADDING,
    ZERO_CHAR
  );
  const seconds = String(now.getSeconds()).padStart(
    TWO_DIGIT_PADDING,
    ZERO_CHAR
  );

  const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

  return `${FILE_NAME_PREFIX}-${timestamp}${FILE_EXTENSION}`;
};

export const createBlobFromPayload = (payload: IEncryptedPayload): Blob => {
  const jsonString = JSON.stringify(payload);

  return new Blob([jsonString], { type: FILE_MIME_TYPE });
};

export const readFileAsText = async (file: File): Promise<string> => {
  const isFileSizeValid = file.size <= MAX_FILE_SIZE;

  if (!isFileSizeValid) {
    throw new Error(ERROR_FILE_TOO_LARGE);
  }

  const isMimeTypeAllowed = ALLOWED_MIME_TYPES.includes(
    file.type as (typeof ALLOWED_MIME_TYPES)[number]
  );

  if (!isMimeTypeAllowed) {
    throw new Error(ERROR_INVALID_FILE_TYPE);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (result !== null && typeof result === TYPE_STRING) {
        resolve(result as string);

        return;
      }

      reject(new Error(ERROR_FAILED_TO_READ_FILE_AS_TEXT));
    };

    reader.onerror = () => {
      reject(new Error(ERROR_FAILED_TO_READ_FILE));
    };

    reader.readAsText(file);
  });
};
