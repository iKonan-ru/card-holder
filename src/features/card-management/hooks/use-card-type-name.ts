import { useCardTypesManagementStore } from '@features/card-types-management';
import { getCardTypeName } from '../lib';

export const useCardTypeName = (typeId: string | undefined): string | null => {
  const cardTypes = useCardTypesManagementStore((state) => state.items);

  return getCardTypeName(typeId, cardTypes);
};
