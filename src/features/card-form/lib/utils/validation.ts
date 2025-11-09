import type { IBankCard } from '@entities/bank-card';
import { EMPTY_STRING } from '@shared/lib';
import type { IValidationErrors } from '../types';
import {
  PAN_FIELD_CONFIG,
  EXPIRES_FIELD_CONFIG,
  NAME_FIELD_CONFIG,
  CVV_FIELD_CONFIG,
  PIN_FIELD_CONFIG,
} from '../constants/field-configs';

const DEFAULT_FIELD_VALUE = EMPTY_STRING;

const VALIDATABLE_FIELDS = [
  PAN_FIELD_CONFIG,
  EXPIRES_FIELD_CONFIG,
  NAME_FIELD_CONFIG,
  CVV_FIELD_CONFIG,
  PIN_FIELD_CONFIG,
] as const;

export const validateCardForm = (
  card: Partial<IBankCard>
): IValidationErrors => {
  return VALIDATABLE_FIELDS.reduce<IValidationErrors>((errors, fieldConfig) => {
    const { name, validator } = fieldConfig;

    if (!validator) {
      return errors;
    }

    const rawValue = card[name as keyof Partial<IBankCard>];
    const fieldValue =
      typeof rawValue === 'string' ? rawValue : DEFAULT_FIELD_VALUE;
    const errorMessage = validator(fieldValue);

    if (errorMessage) {
      return {
        ...errors,
        [name]: errorMessage,
      };
    }

    return errors;
  }, {});
};

export const checkHasErrors = (errors: IValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const checkIsValidBankCard = (
  card: Partial<IBankCard>
): card is IBankCard => {
  return Boolean(
    card.pan &&
      card.expires &&
      card.name &&
      card.cvv &&
      typeof card.order === 'number'
  );
};
