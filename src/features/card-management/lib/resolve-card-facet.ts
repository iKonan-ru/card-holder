import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
import { BANKS_LIST } from '@shared/data';
import { getBankByCardNumber } from '@shared/lib';

export const getBankName = (pan: string): string | null => {
  const bankId = getBankByCardNumber(pan);
  const bank = BANKS_LIST.find((item) => item.id === bankId);

  return bank?.name ?? null;
};

export const getCardTypeName = (
  typeId: string | undefined,
  cardTypes: ICardType[],
): string | null => {
  if (!typeId) {
    return null;
  }

  return cardTypes.find((item) => item.id === typeId)?.name ?? null;
};

export const getOwnerName = (
  ownerId: string | undefined,
  owners: IOwner[],
): string | null => {
  if (!ownerId) {
    return null;
  }

  return owners.find((item) => item.id === ownerId)?.realName ?? null;
};
