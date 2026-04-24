import type { IBankCard } from '@entities/bank-card';
import { FILE_FORMAT_VERSION, type IEncryptedPayload } from '@shared/lib';
import { ERROR_CORRUPTED_FILE, ERROR_UNSUPPORTED_VERSION } from '../constants';
import type { IImportResult } from '../types';

export const parseImportedFile = (fileContent: string): IEncryptedPayload => {
  if (!fileContent || fileContent.trim().length === 0) {
    throw new Error(ERROR_CORRUPTED_FILE);
  }

  try {
    return JSON.parse(fileContent) as IEncryptedPayload;
  } catch {
    throw new Error(ERROR_CORRUPTED_FILE);
  }
};

export const validateImportedPayload = (payload: IEncryptedPayload): void => {
  const hasVersion = typeof payload.version === 'number';
  const hasTimestamp =
    typeof payload.timestamp === 'number' && isFinite(payload.timestamp);
  const hasSalt = typeof payload.salt === 'string' && payload.salt.length > 0;
  const hasIv = typeof payload.iv === 'string' && payload.iv.length > 0;
  const hasEncrypted =
    typeof payload.encrypted === 'string' && payload.encrypted.length > 0;

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

const isValidBankCard = (card: unknown): card is IBankCard =>
  typeof card === 'object' &&
  card !== null &&
  typeof (card as IBankCard).pan === 'string' &&
  (card as IBankCard).pan.length > 0 &&
  typeof (card as IBankCard).expires === 'string' &&
  typeof (card as IBankCard).name === 'string' &&
  typeof (card as IBankCard).cvv === 'string' &&
  typeof (card as IBankCard).order === 'number';

export const parseDecryptedCards = (decryptedData: string): IBankCard[] => {
  try {
    const parsed = JSON.parse(decryptedData) as unknown;

    if (!Array.isArray(parsed)) {
      throw new Error(ERROR_CORRUPTED_FILE);
    }

    return parsed.filter(isValidBankCard);
  } catch {
    throw new Error(ERROR_CORRUPTED_FILE);
  }
};

export const mergeCards = (
  existingCards: IBankCard[],
  importedCards: IBankCard[],
): { cards: IBankCard[]; stats: IImportResult } => {
  const existingPans = new Set(existingCards.map((card) => card.pan));

  let replacedCount = 0;
  let importedCount = 0;

  const mergedCards = [...existingCards];

  importedCards.forEach((importedCard) => {
    const cardExists = existingPans.has(importedCard.pan);

    if (cardExists) {
      const existingIndex = mergedCards.findIndex(
        (card) => card.pan === importedCard.pan,
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
