import type { IBankCard } from '@entities/bank-card';
import { EMPTY_CARD_FORM } from '../constants';
import { formatExpires, formatPan } from './masks';

export const getInitialFormData = (
  initialCard?: Partial<IBankCard>,
): Partial<IBankCard> => {
  if (!initialCard) {
    return EMPTY_CARD_FORM;
  }

  const pan = formatPan(initialCard.pan || '');
  const expires = formatExpires(initialCard.expires || '');

  return {
    ...initialCard,
    pan,
    expires,
  };
};
