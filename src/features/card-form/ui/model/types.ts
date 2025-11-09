import type { IBankCard } from '@entities/bank-card';

export interface ICardPreviewProps {
  pan: string;
}

export interface ICardFormProps {
  initialCard?: Partial<IBankCard>;
  onSuccess?: () => void;
  onCancel?: () => void;
}
