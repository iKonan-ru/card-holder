import { useCallback, useState, type ReactNode } from 'react';
import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
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
import {
  FALLBACK_ERROR_IMPORT,
  PASSWORD_MODAL_ID_IMPORT,
  PASSWORD_MODAL_TITLE_IMPORT,
  SUCCESS_MODAL_ID_IMPORT,
  SUCCESS_MODAL_TITLE_IMPORT,
} from '../constants';
import { PasswordModal, SuccessModal } from '../ui';
import {
  createImportSuccessMessage,
  handleError,
  mergeCards,
  mergeCardTypes,
  mergeOwners,
  parseImportedData,
  parseImportedFile,
  validateImportedPayload,
} from '../utils';

interface IUseImportCardsParams {
  cards: IBankCard[];
  cardTypes: ICardType[];
  owners: IOwner[];
  onImport: (cards: IBankCard[]) => Promise<void>;
  onImportCardTypes: (cardTypes: ICardType[]) => Promise<void>;
  onImportOwners: (owners: IOwner[]) => Promise<void>;
  onUnflipCards: Procedure;
}

interface IUseImportCardsResult {
  isImporting: boolean;
  importCards: () => Promise<void>;
}

export const useImportCards = (
  params: IUseImportCardsParams,
): IUseImportCardsResult => {
  const {
    cards,
    cardTypes,
    owners,
    onImport,
    onImportCardTypes,
    onImportOwners,
    onUnflipCards,
  } = params;
  const [isImporting, setIsImporting] = useState(false);
  const { openModal } = useModalContext();

  const importCards = useCallback(async () => {
    if (isImporting) {
      return;
    }

    try {
      const file = await uploadFile(FILE_EXTENSION);
      const content = await readFileAsText(file);

      const rawPayload = parseImportedFile(content);
      const payload = validateImportedPayload(rawPayload);

      const handleImportWithPassword = async (
        password: string,
        closePasswordModal: Procedure,
        setPasswordError: (error: string) => void,
      ) => {
        try {
          setIsImporting(true);

          const decryptedData = await withRateLimit(() => {
            return decryptData(payload, password);
          });

          const importedData = parseImportedData(decryptedData);

          const { cards: mergedCards, stats } = mergeCards(
            cards,
            importedData.cards,
          );
          const mergedCardTypes = mergeCardTypes(
            cardTypes,
            importedData.cardTypes,
          );
          const mergedOwners = mergeOwners(owners, importedData.owners);

          await Promise.all([
            onImport(mergedCards),
            onImportCardTypes(mergedCardTypes),
            onImportOwners(mergedOwners),
          ]);
          onUnflipCards();

          closePasswordModal();

          const message = createImportSuccessMessage(stats);

          const successContent: ReactNode = <SuccessModal message={message} />;

          openModal(
            SUCCESS_MODAL_ID_IMPORT,
            successContent,
            SUCCESS_MODAL_TITLE_IMPORT,
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
        PASSWORD_MODAL_TITLE_IMPORT,
      );
    } catch (error) {
      const isSelectionCancelled = checkIsFileSelectionCancelled(error);

      if (isSelectionCancelled) {
        return;
      }

      handleError(error, FALLBACK_ERROR_IMPORT);
    }
  }, [
    cards,
    cardTypes,
    owners,
    onImport,
    onImportCardTypes,
    onImportOwners,
    onUnflipCards,
    openModal,
    isImporting,
  ]);

  return {
    isImporting,
    importCards,
  };
};
