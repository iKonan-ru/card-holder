import type { ReactNode } from 'react';
import { generateRandomId, logError, type IModalContext } from '@shared/lib';
import { ERROR_CONTENT_ID_PREFIX, ERROR_CONTENT_TITLE } from '../constants';
import { ErrorContent } from '../ui';
import { translateError } from './utils';

let modalContextRef: IModalContext | null = null;

export const setModalContext = (context: IModalContext): void => {
  modalContextRef = context;
};

export const showError = (params: {
  message: string;
  error?: unknown;
  context?: string;
}): void => {
  if (!modalContextRef) {
    logError({ message: '[Error Handler] Modal context not initialized' });

    return;
  }

  const translatedMessage = translateError(params.message);
  const errorId = `${Date.now()}-${generateRandomId()}`;
  const modalId = `${ERROR_CONTENT_ID_PREFIX}-${errorId}`;

  const modalContent: ReactNode = <ErrorContent message={translatedMessage} />;

  modalContextRef.openModal(modalId, modalContent, ERROR_CONTENT_TITLE);
};
