import { z } from 'zod';
import {
  ERROR_PASSWORD_MISMATCH,
  ERROR_PASSWORD_TOO_LONG,
  ERROR_PASSWORD_TOO_SHORT,
  ERROR_PASSWORD_TOO_SIMPLE,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_DIGIT_PATTERN,
} from '../constants';

export const exportPasswordSchema = z
  .object({
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, ERROR_PASSWORD_TOO_SHORT)
      .max(MAX_PASSWORD_LENGTH, ERROR_PASSWORD_TOO_LONG)
      .regex(PASSWORD_DIGIT_PATTERN, ERROR_PASSWORD_TOO_SIMPLE),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });
