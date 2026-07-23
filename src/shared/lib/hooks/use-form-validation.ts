import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Procedure } from '@shared/types';

export interface IUseFormValidationResult<T> {
  errors: Record<string, string | undefined>;
  setErrors: Dispatch<SetStateAction<T>>;
  handleFieldValidation: (
    fieldName: keyof T,
    error: string | undefined,
  ) => void;
  resetErrors: Procedure;
}

export function useFormValidation<
  T extends Record<string, string | undefined>,
>(): IUseFormValidationResult<T> {
  const [errors, setErrors] = useState<T>({} as T);

  const handleFieldValidation = useCallback(
    (fieldName: keyof T, error: string | undefined) => {
      setErrors((previousErrors) => {
        const hasError = fieldName in previousErrors;

        if (error) {
          return { ...previousErrors, [fieldName]: error };
        }

        if (!hasError) {
          return previousErrors;
        }

        const updatedErrors = { ...previousErrors };
        delete updatedErrors[fieldName];

        return updatedErrors;
      });
    },
    [],
  );

  const resetErrors = useCallback(() => {
    setErrors({} as T);
  }, []);

  return {
    errors,
    setErrors,
    handleFieldValidation,
    resetErrors,
  };
}
