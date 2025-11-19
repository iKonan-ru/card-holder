import { FILE_SELECTION_CANCELLED_ERROR } from './constants';

export const createFileSelectionCancelledError = (): Error => {
  return new Error(FILE_SELECTION_CANCELLED_ERROR);
};

export const checkIsFileSelectionCancelled = (error: unknown): boolean => {
  return (
    error instanceof Error && error.message === FILE_SELECTION_CANCELLED_ERROR
  );
};
