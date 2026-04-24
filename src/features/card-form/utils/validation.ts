import type { IBankCard } from '@entities/bank-card';
import { TYPE_NUMBER } from '@shared/lib';
import type { IValidationErrors } from '../types';
import { cardFormSchema } from './schemas';

export const validateCardForm = (
  card: Partial<IBankCard>,
): IValidationErrors => {
  const result = cardFormSchema.safeParse({
    pan: card.pan ?? '',
    expires: card.expires ?? '',
    name: card.name ?? '',
    cvv: card.cvv ?? '',
    pin: card.pin,
  });

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<IValidationErrors>((acc, issue) => {
    const field = issue.path[0] as string;
    if (field && !acc[field]) {
      acc[field] = issue.message;
    }

    return acc;
  }, {});
};

export const checkHasErrors = (errors: IValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const checkIsValidBankCard = (
  card: Partial<IBankCard>,
): card is IBankCard => {
  return Boolean(
    card.pan &&
    card.expires &&
    card.name &&
    card.cvv &&
    typeof card.order === TYPE_NUMBER,
  );
};
