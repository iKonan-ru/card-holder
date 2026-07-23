import { useCallback, useState, type ReactNode } from 'react';
import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
import {
  createBlobFromPayload,
  downloadFile,
  encryptData,
  generateExportFileName,
  useModalContext,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import {
  FALLBACK_ERROR_EXPORT,
  PASSWORD_MODAL_ID_EXPORT,
  PASSWORD_MODAL_TITLE_EXPORT,
} from '../constants';
import { PasswordModal } from '../ui';
import {
  handleError,
  prepareExportData,
  validateCardsForExport,
} from '../utils';

interface IUseExportCardsParams {
  cards: IBankCard[];
  cardTypes: ICardType[];
  owners: IOwner[];
}

interface IUseExportCardsResult {
  isExporting: boolean;
  exportCards: () => Promise<void>;
}

export const useExportCards = (
  params: IUseExportCardsParams,
): IUseExportCardsResult => {
  const { cards, cardTypes, owners } = params;
  const [isExporting, setIsExporting] = useState(false);
  const { openModal } = useModalContext();

  const handleExportWithPassword = useCallback(
    async (
      password: string,
      closePasswordModal: Procedure,
      setPasswordError: (error: string) => void,
    ) => {
      try {
        setIsExporting(true);

        validateCardsForExport(cards);

        const exportDataJson = prepareExportData({ cards, cardTypes, owners });
        const encryptedPayload = await encryptData(exportDataJson, password);
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
    [cards, cardTypes, owners],
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

      openModal(
        PASSWORD_MODAL_ID_EXPORT,
        modalContent,
        PASSWORD_MODAL_TITLE_EXPORT,
      );
    } catch (error) {
      handleError(error, FALLBACK_ERROR_EXPORT);
    }
  }, [cards, handleExportWithPassword, openModal]);

  return {
    isExporting,
    exportCards,
  };
};
