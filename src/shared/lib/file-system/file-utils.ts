import type { IEncryptedPayload } from '../crypto';
import { FILE_NAME_PREFIX, FILE_EXTENSION, FILE_MIME_TYPE } from './constants';
import {
  MONTH_OFFSET,
  TYPE_STRING,
  ERROR_FAILED_TO_READ_FILE,
  ERROR_FAILED_TO_READ_FILE_AS_TEXT,
} from '../constants';

const TWO_DIGIT_PADDING = 2;
const ZERO_PAD_STRING = '0';

export const generateExportFileName = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + MONTH_OFFSET).padStart(
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
