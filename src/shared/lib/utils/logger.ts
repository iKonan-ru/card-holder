import { showError } from '@features/error-handling';

type LogLevel = 'error' | 'warn' | 'info';

interface ILoggerParams {
  message: string;
  error?: unknown;
  level?: LogLevel;
  context?: string;
  silent?: boolean;
}

const LOG_PREFIX = '[Card Holder]';

/**
 * Логирует ошибку в консоль и опционально показывает модальное окно с ошибкой
 * @param params - Параметры логирования
 * @param params.message - Текст сообщения об ошибке
 * @param params.error - Объект ошибки (опционально)
 * @param params.level - Уровень логирования (error/warn/info), по умолчанию error
 * @param params.context - Контекст где произошла ошибка (опционально)
 * @param params.silent - Не показывать модальное окно, только логировать (по умолчанию false)
 */
export const logError = ({
  message,
  error,
  level = 'error',
  context,
  silent = false,
}: ILoggerParams): void => {
  const fullMessage = context
    ? `${LOG_PREFIX} [${context}] ${message}`
    : `${LOG_PREFIX} ${message}`;

  switch (level) {
    case 'error': {
      if (error) {
        console.error(fullMessage, error);
      } else {
        console.error(fullMessage);
      }

      break;
    }

    case 'warn': {
      if (error) {
        console.warn(fullMessage, error);
      } else {
        console.warn(fullMessage);
      }

      break;
    }

    case 'info': {
      if (error) {
        console.info(fullMessage, error);
      } else {
        console.info(fullMessage);
      }

      break;
    }
  }

  const shouldShowModal = level === 'error' && !silent;

  if (shouldShowModal) {
    showError({
      message,
      error,
      context,
    });
  }
};
