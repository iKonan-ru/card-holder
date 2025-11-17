import type { IBankCard } from '@entities/bank-card';

export interface ICardFormProps {
  initialCard?: Partial<IBankCard>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface ICardFormModalContentProps {
  initialCard?: IBankCard;
  onComplete?: () => void;
}
