import { GLOBAL_ERROR_CONTEXT } from '../constants';
import { showError } from './show-error';

export const initGlobalErrorHandler = (): void => {
  const handleError = (event: ErrorEvent | PromiseRejectionEvent): void => {
    event.preventDefault();

    const isErrorEvent = 'error' in event;
    const error = isErrorEvent ? event.error : event.reason;
    const errorMessage = isErrorEvent
      ? event.message
      : 'Необработанная ошибка Promise';

    showError({
      message: errorMessage,
      error,
      context: GLOBAL_ERROR_CONTEXT,
    });
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleError);
};
