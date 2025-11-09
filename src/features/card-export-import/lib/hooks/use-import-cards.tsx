import { useState, useCallback, type ReactNode } from 'react';
import type { IBankCard } from '@entities/bank-card';
import {
  decryptData,
  uploadFile,
  readFileAsText,
  useModalContext,
  FILE_EXTENSION,
  checkIsFileSelectionCancelled,
} from '@shared/lib';
import {
  parseImportedFile,
  validateImportedPayload,
  parseDecryptedCards,
  mergeCards,
  handleError,
  createImportSuccessMessage,
} from '../utils';
import { PasswordModal } from '../../ui/password-modal';
import {
  PASSWORD_MODAL_TITLE_ID,
  PASSWORD_MODAL_DESCRIPTION_ID,
} from '../../ui/password-modal/lib/constants';
import { SuccessModal } from '../../ui/success-modal';
import {
  SUCCESS_MODAL_TITLE_ID,
  SUCCESS_MODAL_MESSAGE_ID,
} from '../../ui/success-modal/lib/constants';
import {
  SUCCESS_MODAL_TITLE_IMPORT,
  FALLBACK_ERROR_IMPORT,
} from '../../model/constants';

const PASSWORD_MODAL_ID = 'password-modal-import';
const SUCCESS_MODAL_ID = 'success-modal-import';

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
    try {
      const file = await uploadFile(FILE_EXTENSION);
      const content = await readFileAsText(file);

      const payload = parseImportedFile(content);
      validateImportedPayload(payload);

      const handleImportWithPassword = async (password: string) => {
        modalContext.closeModal(PASSWORD_MODAL_ID);

        try {
          setIsImporting(true);

          const decryptedData = await decryptData(payload, password);

          const importedCards = parseDecryptedCards(decryptedData);

          const { cards: mergedCards, stats } = mergeCards(
            cards,
            importedCards
          );

          await onImport(mergedCards);
          onUnflipCards();

          const message = createImportSuccessMessage(stats);

          const handleCloseSuccess = () => {
            modalContext.closeModal(SUCCESS_MODAL_ID);
          };

          const successContent: ReactNode = (
            <SuccessModal
              title={SUCCESS_MODAL_TITLE_IMPORT}
              message={message}
              onClose={handleCloseSuccess}
            />
          );

          modalContext.openModal(
            SUCCESS_MODAL_ID,
            successContent,
            handleCloseSuccess,
            SUCCESS_MODAL_TITLE_ID,
            SUCCESS_MODAL_MESSAGE_ID
          );
        } catch (error) {
          handleError(error, FALLBACK_ERROR_IMPORT);
        } finally {
          setIsImporting(false);
        }
      };

      const handleCancel = () => {
        modalContext.closeModal(PASSWORD_MODAL_ID);
      };

      const modalContent: ReactNode = (
        <PasswordModal
          mode="import"
          onConfirm={handleImportWithPassword}
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
      const isSelectionCancelled = checkIsFileSelectionCancelled(error);

      if (isSelectionCancelled) {
        return;
      }

      handleError(error, FALLBACK_ERROR_IMPORT);
    }
  }, [cards, onImport, onUnflipCards, modalContext]);

  return {
    isImporting,
    importCards,
  };
};
