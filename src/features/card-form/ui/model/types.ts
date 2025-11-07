import type { PropsWithParentClass } from '@shared/types';
import type { IBankCard } from '@entities/bank-card';

export interface ICardPreviewProps extends PropsWithParentClass {
  pan: string;
}

export interface ICardFormProps extends PropsWithParentClass {
  initialCard?: Partial<IBankCard>;
  onSuccess?: () => void;
  onCancel?: () => void;
}
