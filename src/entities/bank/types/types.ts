import type { TBankKeys } from '@shared/data';

export interface IBank {
  id: TBankKeys;
  name?: string;
  color: string;
  isDarkText?: boolean;
}
