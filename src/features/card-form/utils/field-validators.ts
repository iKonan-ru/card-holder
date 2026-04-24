import { type ZodTypeAny } from 'zod';
import {
  cvvSchema,
  expiresSchema,
  nameSchema,
  panSchema,
  pinSchema,
} from './schemas';

const makeValidator =
  (schema: ZodTypeAny) =>
  (value: string): string | undefined => {
    const result = schema.safeParse(value);

    return result.success ? undefined : result.error.issues[0]?.message;
  };

export const validatePan = makeValidator(panSchema);
export const validateExpires = makeValidator(expiresSchema);
export const validateName = makeValidator(nameSchema);
export const validateCvv = makeValidator(cvvSchema);
export const validatePin = makeValidator(pinSchema);
