type LogLevel = 'error' | 'warn' | 'info';

interface ILoggerParams {
  message: string;
  error?: unknown;
  level?: LogLevel;
  context?: string;
  silent?: boolean;
}

const LOG_PREFIX = '[Card Holder]';

let errorModalHandler:
  | ((params: { message: string; error?: unknown; context?: string }) => void)
  | null = null;

export const setErrorModalHandler = (
  handler: (params: {
    message: string;
    error?: unknown;
    context?: string;
  }) => void
) => {
  errorModalHandler = handler;
};

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

  const shouldShowModal = level === 'error' && !silent && errorModalHandler;

  if (shouldShowModal && errorModalHandler) {
    errorModalHandler({
      message,
      error,
      context,
    });
  }
};
