import type { IBankCard } from '@entities/bank-card';
import { FILE_FORMAT_VERSION, type IEncryptedPayload } from '@shared/lib';
import type { IImportResult } from '../../../../model';
import {
  ERROR_CORRUPTED_FILE,
  ERROR_UNSUPPORTED_VERSION,
} from '../../../../lib/constants';

export const parseImportedFile = (fileContent: string): IEncryptedPayload => {
  if (!fileContent || fileContent.trim().length === 0) {
    throw new Error(ERROR_CORRUPTED_FILE);
  }

  try {
    const payload = JSON.parse(fileContent) as IEncryptedPayload;

    return payload;
  } catch {
    throw new Error(ERROR_CORRUPTED_FILE);
  }
};

export const validateImportedPayload = (payload: IEncryptedPayload): void => {
  const hasVersion = typeof payload.version === 'number';
  const hasTimestamp = typeof payload.timestamp === 'number';
  const hasSalt = typeof payload.salt === 'string';
  const hasIv = typeof payload.iv === 'string';
  const hasEncrypted = typeof payload.encrypted === 'string';

  const isValidStructure =
    hasVersion && hasTimestamp && hasSalt && hasIv && hasEncrypted;

  if (!isValidStructure) {
    throw new Error(ERROR_CORRUPTED_FILE);
  }

  const isVersionSupported = payload.version === FILE_FORMAT_VERSION;

  if (!isVersionSupported) {
    throw new Error(ERROR_UNSUPPORTED_VERSION);
  }
};

export const parseDecryptedCards = (decryptedData: string): IBankCard[] => {
  try {
    const cards = JSON.parse(decryptedData) as IBankCard[];

    const isArray = Array.isArray(cards);

    if (!isArray) {
      throw new Error(ERROR_CORRUPTED_FILE);
    }

    return cards;
  } catch {
    throw new Error(ERROR_CORRUPTED_FILE);
  }
};

export const mergeCards = (
  existingCards: IBankCard[],
  importedCards: IBankCard[]
): { cards: IBankCard[]; stats: IImportResult } => {
  const existingPans = new Set(existingCards.map((card) => card.pan));

  let replacedCount = 0;
  let importedCount = 0;

  const mergedCards = [...existingCards];

  importedCards.forEach((importedCard) => {
    const cardExists = existingPans.has(importedCard.pan);

    if (cardExists) {
      const existingIndex = mergedCards.findIndex(
        (card) => card.pan === importedCard.pan
      );
      mergedCards[existingIndex] = importedCard;
      replacedCount++;

      return;
    }

    mergedCards.push(importedCard);
    importedCount++;
  });

  return {
    cards: mergedCards,
    stats: {
      imported: importedCount,
      replaced: replacedCount,
      total: importedCards.length,
    },
  };
};
