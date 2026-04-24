import { z } from 'zod';
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
} from '../constants';
import { validateLuhn } from './luhn';

export const panSchema = z.string().superRefine((val, ctx) => {
  if (!val) {
    ctx.addIssue({ code: 'custom', message: ERROR_PAN_REQUIRED });

    return z.NEVER;
  }

  const digits = val.replace(SPACE_REMOVAL_PATTERN, '');

  if (digits.length !== PAN_LENGTH) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_PAN_INVALID_LENGTH,
    });

    return z.NEVER;
  }

  if (!validateLuhn(digits)) {
    ctx.addIssue({ code: 'custom', message: ERROR_PAN_INVALID });
  }
});

export const expiresSchema = z.string().superRefine((val, ctx) => {
  if (!val) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_EXPIRES_REQUIRED,
    });

    return z.NEVER;
  }

  const digits = val.replace(NON_DIGIT_REMOVAL_PATTERN, '');
  const month = digits.slice(MONTH_START_INDEX, MONTH_END_INDEX);
  const year = digits.slice(MONTH_END_INDEX);

  if (!MONTH_VALIDATION_PATTERN.test(month)) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_EXPIRES_MONTH,
    });

    return z.NEVER;
  }

  if (parseInt(year, DECIMAL_RADIX) < MIN_YEAR) {
    ctx.addIssue({ code: 'custom', message: ERROR_EXPIRES_YEAR });
  }
});

export const nameSchema = z.string().superRefine((val, ctx) => {
  if (!val) {
    ctx.addIssue({ code: 'custom', message: ERROR_NAME_REQUIRED });

    return z.NEVER;
  }

  if (val.trim().length < MIN_NAME_LENGTH) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_NAME_TOO_SHORT,
    });
  }
});

export const cvvSchema = z.string().superRefine((val, ctx) => {
  if (!val) {
    ctx.addIssue({ code: 'custom', message: ERROR_CVV_REQUIRED });

    return z.NEVER;
  }

  if (val.length !== CVV_MAX_LENGTH || !DIGITS_ONLY_PATTERN.test(val)) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_CVV_INVALID_LENGTH,
    });
  }
});

const pinRefinement = (val: string | undefined, ctx: z.RefinementCtx): void => {
  if (!val) return;
  if (val.length !== PIN_MAX_LENGTH) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_PIN_INVALID_LENGTH,
    });
  }
};

export const pinSchema = z.string().superRefine(pinRefinement);

export const cardFormSchema = z.object({
  pan: panSchema,
  expires: expiresSchema,
  name: nameSchema,
  cvv: cvvSchema,
  pin: z.string().optional().superRefine(pinRefinement),
});
