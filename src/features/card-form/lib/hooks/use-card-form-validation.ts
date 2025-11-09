import { useFormValidation } from '@shared/lib';
import type { IValidationErrors } from '../types';

export const useCardFormValidation = () => {
  return useFormValidation<IValidationErrors>();
};
