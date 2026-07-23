import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
import {
  FILE_FORMAT_VERSION,
  type IEncryptedPayload,
  type IValidatedEncryptedPayload,
} from '@shared/lib';
import { ERROR_CORRUPTED_FILE, ERROR_UNSUPPORTED_VERSION } from '../constants';
import type { IExportData, IImportResult } from '../types';

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

export const validateImportedPayload = (
  payload: IEncryptedPayload,
): IValidatedEncryptedPayload => {
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

  return payload as IValidatedEncryptedPayload;
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

const isValidCardType = (cardType: unknown): cardType is ICardType =>
  typeof cardType === 'object' &&
  cardType !== null &&
  typeof (cardType as ICardType).id === 'string' &&
  typeof (cardType as ICardType).name === 'string';

const isValidOwner = (owner: unknown): owner is IOwner =>
  typeof owner === 'object' &&
  owner !== null &&
  typeof (owner as IOwner).id === 'string' &&
  typeof (owner as IOwner).realName === 'string';

const parseLegacyCardsOnlyFormat = (parsed: unknown[]): IExportData => ({
  cards: parsed.filter(isValidBankCard),
  cardTypes: [],
  owners: [],
});

export const parseImportedData = (decryptedData: string): IExportData => {
  try {
    const parsed = JSON.parse(decryptedData) as unknown;

    if (Array.isArray(parsed)) {
      return parseLegacyCardsOnlyFormat(parsed);
    }

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error(ERROR_CORRUPTED_FILE);
    }

    const data = parsed as Partial<IExportData>;
    const cards = Array.isArray(data.cards) ? data.cards : [];
    const cardTypes = Array.isArray(data.cardTypes) ? data.cardTypes : [];
    const owners = Array.isArray(data.owners) ? data.owners : [];

    return {
      cards: cards.filter(isValidBankCard),
      cardTypes: cardTypes.filter(isValidCardType),
      owners: owners.filter(isValidOwner),
    };
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

const mergeById = <T extends { id: string }>(
  existingItems: T[],
  importedItems: T[],
): T[] => {
  const mergedItems = [...existingItems];

  importedItems.forEach((importedItem) => {
    const existingIndex = mergedItems.findIndex(
      (item) => item.id === importedItem.id,
    );

    if (existingIndex === -1) {
      mergedItems.push(importedItem);

      return;
    }

    mergedItems[existingIndex] = importedItem;
  });

  return mergedItems;
};

export const mergeCardTypes = (
  existingCardTypes: ICardType[],
  importedCardTypes: ICardType[],
): ICardType[] => mergeById(existingCardTypes, importedCardTypes);

export const mergeOwners = (
  existingOwners: IOwner[],
  importedOwners: IOwner[],
): IOwner[] => mergeById(existingOwners, importedOwners);
