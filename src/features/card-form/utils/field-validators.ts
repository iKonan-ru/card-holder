import { DECIMAL_RADIX, SPACE_REMOVAL_PATTERN } from '@shared/lib';
import {
  CVV_MAX_LENGTH,
  DIGITS_ONLY_PATTERN,
  ERROR_CVV_INVALID_LENGTH,
  ERROR_CVV_REQUIRED,
  ERROR_EXPIRES_MONTH,
  ERROR_EXPIRES_REQUIRED,
  ERROR_EXPIRES_YEAR,
  ERROR_NAME_REQUIRED,
  ERROR_NAME_TOO_SHORT,
  ERROR_PAN_INVALID,
  ERROR_PAN_INVALID_LENGTH,
  ERROR_PAN_REQUIRED,
  ERROR_PIN_INVALID_LENGTH,
  MIN_NAME_LENGTH,
  MIN_YEAR,
  MONTH_END_INDEX,
  MONTH_START_INDEX,
  MONTH_VALIDATION_PATTERN,
  NON_DIGIT_REMOVAL_PATTERN,
  PAN_LENGTH,
  PIN_MAX_LENGTH,
  YEAR_END_INDEX,
  YEAR_START_INDEX,
} from '../constants';
import { validateLuhn } from './luhn';

export const validatePan = (value: string): string | undefined => {
  if (!value) {
    return ERROR_PAN_REQUIRED;
  }

  const panDigits = value.replace(SPACE_REMOVAL_PATTERN, '');

  if (panDigits.length !== PAN_LENGTH) {
    return ERROR_PAN_INVALID_LENGTH;
  }

  if (!validateLuhn(panDigits)) {
    return ERROR_PAN_INVALID;
  }

  return undefined;
};

export const validateExpires = (value: string): string | undefined => {
  if (!value) {
    return ERROR_EXPIRES_REQUIRED;
  }

  const expiresDigits = value.replace(NON_DIGIT_REMOVAL_PATTERN, '');
  const month = expiresDigits.slice(MONTH_START_INDEX, MONTH_END_INDEX);
  const year = expiresDigits.slice(YEAR_START_INDEX, YEAR_END_INDEX);

  if (!MONTH_VALIDATION_PATTERN.test(month)) {
    return ERROR_EXPIRES_MONTH;
  }

  if (parseInt(year, DECIMAL_RADIX) < MIN_YEAR) {
    return ERROR_EXPIRES_YEAR;
  }

  return undefined;
};

export const validateName = (value: string): string | undefined => {
  if (!value) {
    return ERROR_NAME_REQUIRED;
  }

  if (value.trim().length < MIN_NAME_LENGTH) {
    return ERROR_NAME_TOO_SHORT;
  }

  return undefined;
};

export const validateCvv = (value: string): string | undefined => {
  if (!value) {
    return ERROR_CVV_REQUIRED;
  }

  if (value.length !== CVV_MAX_LENGTH || !DIGITS_ONLY_PATTERN.test(value)) {
    return ERROR_CVV_INVALID_LENGTH;
  }

  return undefined;
};

export const validatePin = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (value.length !== PIN_MAX_LENGTH) {
    return ERROR_PIN_INVALID_LENGTH;
  }

  return undefined;
};
