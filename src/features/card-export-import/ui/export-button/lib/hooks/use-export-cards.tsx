import { useState, useCallback, type ReactNode } from 'react';
import type { IBankCard } from '@entities/bank-card';
import {
  encryptData,
  generateExportFileName,
  createBlobFromPayload,
  downloadFile,
  useModalContext,
} from '@shared/lib';
import { validateCardsForExport, prepareCardsForExport } from '../utils';
import { handleError } from '../../../../lib/utils';
import { PasswordModal } from '../../../password-modal';
import {
  PASSWORD_MODAL_TITLE_ID,
  PASSWORD_MODAL_DESCRIPTION_ID,
} from '../../../password-modal/lib/constants';
import { PASSWORD_MODAL_ID } from '../constants';
import { FALLBACK_ERROR_EXPORT } from '../../../../model/constants';

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
    async (
      password: string,
      closePasswordModal: () => void,
      setPasswordError: (error: string) => void
    ) => {
      try {
        setIsExporting(true);

        validateCardsForExport(cards);

        const cardsJson = prepareCardsForExport(cards);

        const encryptedPayload = await encryptData(cardsJson, password);

        const blob = createBlobFromPayload(encryptedPayload);

        const fileName = generateExportFileName();

        downloadFile(blob, fileName);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : FALLBACK_ERROR_EXPORT;
        setPasswordError(errorMessage);
      } finally {
        closePasswordModal();
        setIsExporting(false);
      }
    },
    [cards]
  );

  const exportCards = useCallback(async () => {
    try {
      validateCardsForExport(cards);

      const modalContent: ReactNode = (
        <PasswordModal
          mode="export"
          onConfirm={handleExportWithPassword}
        />
      );

      modalContext.openModal(
        PASSWORD_MODAL_ID,
        modalContent,
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
