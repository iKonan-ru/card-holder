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

/**
 * Устанавливает контекст модальных окон для использования в showError
 * @param context - Контекст модальных окон из ModalProvider
 */
export const setModalContext = (context: IModalContextValue): void => {
  modalContextRef = context;
};

/**
 * Показывает модальное окно с ошибкой
 * Переводит сообщение об ошибке и отображает его в модальном окне
 * @param params - Параметры отображения ошибки
 * @param params.message - Техническое сообщение об ошибке
 * @param params.error - Объект ошибки (опционально)
 * @param params.context - Контекст где произошла ошибка (опционально)
 */
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
