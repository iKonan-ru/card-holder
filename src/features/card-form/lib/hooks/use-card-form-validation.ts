import { useState, useCallback } from 'react';
import type { IValidationErrors } from '../types';

export const useCardFormValidation = () => {
  const [errors, setErrors] = useState<IValidationErrors>({});

  const handleFieldValidation = useCallback(
    (fieldName: string, error: string | undefined) => {
      setErrors((previousErrors) => {
        const isValidField = fieldName in previousErrors;

        if (error) {
          return { ...previousErrors, [fieldName]: error };
        }

        if (!isValidField) {
          return previousErrors;
        }

        const updatedErrors = { ...previousErrors };
        delete updatedErrors[fieldName as keyof IValidationErrors];

        return updatedErrors;
      });
    },
    []
  );

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    setErrors,
    handleFieldValidation,
    resetErrors,
  };
};
