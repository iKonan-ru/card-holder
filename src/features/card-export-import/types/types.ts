import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';

export type TPasswordModalMode = 'export' | 'import';

export interface IImportResult {
  imported: number;
  replaced: number;
  total: number;
}

export interface IExportData {
  cards: IBankCard[];
  cardTypes: ICardType[];
  owners: IOwner[];
}
