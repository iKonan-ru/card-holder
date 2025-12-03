import { useFormValidation, type IUseFormValidationResult } from '@shared/lib';
import type { IValidationErrors } from '../types';

export const useCardFormValidation =
  (): IUseFormValidationResult<IValidationErrors> => {
    return useFormValidation<IValidationErrors>();
  };
