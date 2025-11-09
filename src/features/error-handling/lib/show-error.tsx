import type { ReactNode } from 'react';
import type { IModalContextValue } from '@shared/lib';
import { ErrorContent } from '../ui/error-content';
import { translateError } from './utils';
import {
  ERROR_MODAL_ID_PREFIX,
  ERROR_MODAL_TITLE_ID,
  ERROR_MODAL_MESSAGE_ID,
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
  const errorId = `${Date.now()}-${Math.random()}`;
  const modalId = `${ERROR_MODAL_ID_PREFIX}-${errorId}`;

  const handleClose = () => {
    modalContextRef?.closeModal(modalId);
  };

  const modalContent: ReactNode = (
    <ErrorContent
      message={translatedMessage}
      onClose={handleClose}
    />
  );

  modalContextRef.openModal(
    modalId,
    modalContent,
    handleClose,
    ERROR_MODAL_TITLE_ID,
    ERROR_MODAL_MESSAGE_ID
  );
};
