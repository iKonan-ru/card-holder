import { useCallback, useState, type ReactNode } from 'react';
import type { IBankCard } from '@entities/bank-card';
import {
  checkIsFileSelectionCancelled,
  decryptData,
  FILE_EXTENSION,
  readFileAsText,
  uploadFile,
  useModalContext,
  withRateLimit,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { PasswordModal, SuccessModal } from '../../ui';
import {
  FALLBACK_ERROR_IMPORT,
  PASSWORD_MODAL_ID_IMPORT,
  PASSWORD_MODAL_TITLE_IMPORT,
  SUCCESS_MODAL_ID_IMPORT,
  SUCCESS_MODAL_TITLE_IMPORT,
} from '../constants';
import {
  createImportSuccessMessage,
  handleError,
  mergeCards,
  parseDecryptedCards,
  parseImportedFile,
  validateImportedPayload,
} from '../utils';

interface IUseImportCardsParams {
  cards: IBankCard[];
  onImport: (cards: IBankCard[]) => Promise<void>;
  onUnflipCards: Procedure;
}

interface IUseImportCardsResult {
  isImporting: boolean;
  importCards: () => Promise<void>;
}

export const useImportCards = (
  params: IUseImportCardsParams
): IUseImportCardsResult => {
  const { cards, onImport, onUnflipCards } = params;
  const [isImporting, setIsImporting] = useState(false);
  const { openModal } = useModalContext();

  const importCards = useCallback(async () => {
    if (isImporting) {
      return;
    }
    try {
      const file = await uploadFile(FILE_EXTENSION);
      const content = await readFileAsText(file);

      const payload = parseImportedFile(content);
      validateImportedPayload(payload);

      const handleImportWithPassword = async (
        password: string,
        closePasswordModal: Procedure,
        setPasswordError: (error: string) => void
      ) => {
        try {
          setIsImporting(true);

          const decryptedData = await withRateLimit(() => {
            return decryptData(payload, password);
          });

          const importedCards = parseDecryptedCards(decryptedData);

          const { cards: mergedCards, stats } = mergeCards(
            cards,
            importedCards
          );

          await onImport(mergedCards);
          onUnflipCards();

          closePasswordModal();

          const message = createImportSuccessMessage(stats);

          const successContent: ReactNode = <SuccessModal message={message} />;

          openModal(
            SUCCESS_MODAL_ID_IMPORT,
            successContent,
            SUCCESS_MODAL_TITLE_IMPORT
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : FALLBACK_ERROR_IMPORT;
          setPasswordError(errorMessage);

          throw error;
        } finally {
          setIsImporting(false);
        }
      };

      const modalContent: ReactNode = (
        <PasswordModal
          mode="import"
          onConfirm={handleImportWithPassword}
        />
      );

      openModal(
        PASSWORD_MODAL_ID_IMPORT,
        modalContent,
        PASSWORD_MODAL_TITLE_IMPORT
      );
    } catch (error) {
      const isSelectionCancelled = checkIsFileSelectionCancelled(error);

      if (isSelectionCancelled) {
        return;
      }

      handleError(error, FALLBACK_ERROR_IMPORT);
    }
  }, [cards, onImport, onUnflipCards, openModal, isImporting]);

  return {
    isImporting,
    importCards,
  };
};
