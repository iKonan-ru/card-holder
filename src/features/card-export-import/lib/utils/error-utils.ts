import { showError } from '@features/error-handling';

export const handleError = (error: unknown, fallbackMessage: string): void => {
  const errorMessage = error instanceof Error ? error.message : fallbackMessage;

  showError({
    message: errorMessage,
    error,
  });
};
