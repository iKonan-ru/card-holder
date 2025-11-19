import { useState, useCallback } from 'react';
import { INITIAL_ZERO } from '../constants';

const INITIAL_ERRORS_COUNT = INITIAL_ZERO;

export function useFormValidation<
  T extends Record<string, string | undefined>,
>() {
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
    []
  );

  const resetErrors = useCallback(() => {
    setErrors({} as T);
  }, []);

  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > INITIAL_ERRORS_COUNT;
  }, [errors]);

  const getFieldError = useCallback(
    (fieldName: keyof T): string | undefined => {
      return errors[fieldName];
    },
    [errors]
  );

  const setMultipleErrors = useCallback((newErrors: Partial<T>) => {
    setErrors((previousErrors) => ({
      ...previousErrors,
      ...newErrors,
    }));
  }, []);

  const clearFieldError = useCallback(
    (fieldName: keyof T) => {
      handleFieldValidation(fieldName, undefined);
    },
    [handleFieldValidation]
  );

  return {
    errors,
    setErrors,
    handleFieldValidation,
    resetErrors,
    hasErrors,
    getFieldError,
    setMultipleErrors,
    clearFieldError,
  };
}

export type {};
