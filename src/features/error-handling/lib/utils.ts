import { DEFAULT_ERROR_MESSAGE } from './constants';

/**
 * Переводит техническое сообщение об ошибке на русский язык
 * @param message - Сообщение об ошибке
 * @returns Сообщение или дефолтное сообщение если оно пустое
 */
export const translateError = (message: string): string => {
  if (message && message.trim().length > 0) {
    return message;
  }

  return DEFAULT_ERROR_MESSAGE;
};

/**
 * Извлекает текст сообщения из объекта ошибки
 * @param error - Объект ошибки любого типа
 * @returns Текст сообщения об ошибке или дефолтное сообщение
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
};
