import { z } from 'zod';
import {
  ERROR_PASSWORD_MISMATCH,
  ERROR_PASSWORD_TOO_SHORT,
  MIN_PASSWORD_LENGTH,
} from '../constants';

export const exportPasswordSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH, ERROR_PASSWORD_TOO_SHORT),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });
