import { useState, useCallback, type ReactNode } from 'react';
import type { IBankCard } from '@entities/bank-card';
import {
  decryptData,
  uploadFile,
  readFileAsText,
  useModalContext,
  FILE_EXTENSION,
  checkIsFileSelectionCancelled,
  withRateLimit,
} from '@shared/lib';
import { handleError, createImportSuccessMessage } from '../../../../lib/utils';
import {
  parseImportedFile,
  validateImportedPayload,
  parseDecryptedCards,
  mergeCards,
} from '../utils';
import { PasswordModal } from '../../../password-modal';
import {
  PASSWORD_MODAL_TITLE_ID,
  PASSWORD_MODAL_DESCRIPTION_ID,
} from '../../../password-modal/lib/constants';
import { SuccessModal } from '../../../success-modal';
import {
  SUCCESS_MODAL_TITLE_ID,
  SUCCESS_MODAL_MESSAGE_ID,
} from '../../../success-modal/lib/constants';
import {
  FALLBACK_ERROR_IMPORT,
  SUCCESS_MODAL_TITLE_IMPORT,
} from '../../../../model/constants';
import { PASSWORD_MODAL_ID, SUCCESS_MODAL_ID } from '../constants';

interface IUseImportCardsParams {
  cards: IBankCard[];
  onImport: (cards: IBankCard[]) => Promise<void>;
  onUnflipCards: () => void;
}

interface IUseImportCards {
  isImporting: boolean;
  importCards: () => Promise<void>;
}

export const useImportCards = (
  params: IUseImportCardsParams
): IUseImportCards => {
  const { cards, onImport, onUnflipCards } = params;
  const [isImporting, setIsImporting] = useState(false);
  const modalContext = useModalContext();

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
        closePasswordModal: () => void,
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

          const successContent: ReactNode = (
            <SuccessModal
              title={SUCCESS_MODAL_TITLE_IMPORT}
              message={message}
            />
          );

          modalContext.openModal(
            SUCCESS_MODAL_ID,
            successContent,
            SUCCESS_MODAL_TITLE_ID,
            SUCCESS_MODAL_MESSAGE_ID
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

      modalContext.openModal(
        PASSWORD_MODAL_ID,
        modalContent,
        PASSWORD_MODAL_TITLE_ID,
        PASSWORD_MODAL_DESCRIPTION_ID
      );
    } catch (error) {
      const isSelectionCancelled = checkIsFileSelectionCancelled(error);

      if (isSelectionCancelled) {
        return;
      }

      handleError(error, FALLBACK_ERROR_IMPORT);
    }
  }, [cards, onImport, onUnflipCards, modalContext, isImporting]);

  return {
    isImporting,
    importCards,
  };
};
