import { ERROR_MESSAGES, DEFAULT_ERROR_MESSAGE } from './constants';

/**
 * Переводит техническое сообщение об ошибке на русский язык
 * @param message - Техническое сообщение об ошибке на английском
 * @returns Переведённое сообщение или дефолтное сообщение если перевод не найден
 */
export const translateError = (message: string): string => {
  const translatedMessage = ERROR_MESSAGES[message];

  if (translatedMessage) {
    return translatedMessage;
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
