import { useState, useCallback, type ReactNode } from 'react';
import type { IBankCard } from '@entities/bank-card';
import {
  encryptData,
  generateExportFileName,
  createBlobFromPayload,
  downloadFile,
  useModalContext,
} from '@shared/lib';
import {
  validateCardsForExport,
  prepareCardsForExport,
  handleError,
} from '../utils';
import { PasswordModal } from '../../ui/password-modal';
import {
  PASSWORD_MODAL_TITLE_ID,
  PASSWORD_MODAL_DESCRIPTION_ID,
} from '../../ui/password-modal/lib/constants';
import { FALLBACK_ERROR_EXPORT } from '../../model/constants';

const PASSWORD_MODAL_ID = 'password-modal-export';

interface IUseExportCardsParams {
  cards: IBankCard[];
}

interface IUseExportCards {
  isExporting: boolean;
  exportCards: () => Promise<void>;
}

export const useExportCards = (
  params: IUseExportCardsParams
): IUseExportCards => {
  const { cards } = params;
  const [isExporting, setIsExporting] = useState(false);
  const modalContext = useModalContext();

  const handleExportWithPassword = useCallback(
    async (password: string) => {
      modalContext.closeModal(PASSWORD_MODAL_ID);

      try {
        setIsExporting(true);

        validateCardsForExport(cards);

        const cardsJson = prepareCardsForExport(cards);

        const encryptedPayload = await encryptData(cardsJson, password);

        const blob = createBlobFromPayload(encryptedPayload);

        const fileName = generateExportFileName();

        downloadFile(blob, fileName);
      } catch (error) {
        handleError(error, FALLBACK_ERROR_EXPORT);
      } finally {
        setIsExporting(false);
      }
    },
    [cards, modalContext]
  );

  const exportCards = useCallback(async () => {
    try {
      validateCardsForExport(cards);

      const handleCancel = () => {
        modalContext.closeModal(PASSWORD_MODAL_ID);
      };

      const modalContent: ReactNode = (
        <PasswordModal
          mode="export"
          onConfirm={handleExportWithPassword}
          onCancel={handleCancel}
        />
      );

      modalContext.openModal(
        PASSWORD_MODAL_ID,
        modalContent,
        handleCancel,
        PASSWORD_MODAL_TITLE_ID,
        PASSWORD_MODAL_DESCRIPTION_ID
      );
    } catch (error) {
      handleError(error, FALLBACK_ERROR_EXPORT);
    }
  }, [cards, handleExportWithPassword, modalContext]);

  return {
    isExporting,
    exportCards,
  };
};
