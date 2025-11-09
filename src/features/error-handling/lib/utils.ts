import { DEFAULT_ERROR_MESSAGE } from './constants';

export const translateError = (message: string): string => {
  if (message && message.trim().length > 0) {
    return message;
  }

  return DEFAULT_ERROR_MESSAGE;
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
};
