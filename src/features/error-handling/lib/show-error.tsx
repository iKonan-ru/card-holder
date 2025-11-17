import type { ReactNode } from 'react';
import type { IModalContextValue } from '@shared/lib';
import { generateRandomId } from '@shared/lib';
import { ErrorContent } from '../ui/error-content';
import { translateError } from './utils';
import {
  ERROR_CONTENT_ID_PREFIX,
  ERROR_CONTENT_TITLE_ID,
  ERROR_CONTENT_MESSAGE_ID,
  ERROR_CONTENT_TITLE,
} from './constants';

let modalContextRef: IModalContextValue | null = null;

export const setModalContext = (context: IModalContextValue): void => {
  modalContextRef = context;
};

export const showError = (params: {
  message: string;
  error?: unknown;
  context?: string;
}): void => {
  if (!modalContextRef) {
    console.error('[Error Handler] Modal context not initialized');

    return;
  }

  const translatedMessage = translateError(params.message);
  const errorId = `${Date.now()}-${generateRandomId()}`;
  const modalId = `${ERROR_CONTENT_ID_PREFIX}-${errorId}`;

  const modalContent: ReactNode = <ErrorContent message={translatedMessage} />;

  modalContextRef.openModal(
    modalId,
    modalContent,
    ERROR_CONTENT_TITLE_ID,
    ERROR_CONTENT_MESSAGE_ID,
    ERROR_CONTENT_TITLE
  );
};
