import type { ICardType } from '@entities/card-type';

export interface ICardTypesManagementState {
  cardTypes: ICardType[];
  isLoading: boolean;
}

export interface ICardTypesManagementActions {
  loadCardTypes: () => Promise<void>;
  addCardType: (name: string) => Promise<void>;
  updateCardType: (cardType: ICardType) => Promise<void>;
  deleteCardType: (id: string) => Promise<void>;
}
