import { DEFAULT_ERROR_MESSAGE } from '../constants';

export const translateError = (message: string): string => {
  if (message && message.trim().length > 0) {
    return message;
  }

  return DEFAULT_ERROR_MESSAGE;
};
