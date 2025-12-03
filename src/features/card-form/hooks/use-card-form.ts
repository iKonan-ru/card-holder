import type { FormEvent } from 'react';
import type { IBankCard } from '@entities/bank-card';
import type { Procedure } from '@shared/types';
import {
  useCardFormState,
  useCardFormSubmit,
  useCardFormValidation,
} from '../hooks';
import type { IValidationErrors } from '../types';

interface IUseCardFormParams {
  initialCard?: Partial<IBankCard>;
  onSuccess?: Procedure;
}

interface IUseCardFormResult {
  formData: Partial<IBankCard>;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
  isEditMode: boolean;
  handleFieldChange: (fieldName: string, value: string) => void;
  handleFieldValidation: (
    fieldName: keyof IValidationErrors,
    error: string | undefined
  ) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete: () => Promise<void>;
}

export const useCardForm = ({
  initialCard,
  onSuccess,
}: IUseCardFormParams = {}): IUseCardFormResult => {
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    isEditMode,
    originalPan,
    handleFieldChange,
    resetForm,
  } = useCardFormState({ initialCard });

  const { errors, setErrors, handleFieldValidation, resetErrors } =
    useCardFormValidation();

  const { handleSubmit, handleDelete } = useCardFormSubmit({
    formData,
    isEditMode,
    originalPan,
    setErrors,
    setIsSubmitting,
    resetForm,
    resetErrors,
    onSuccess,
  });

  return {
    formData,
    errors,
    isSubmitting,
    isEditMode,
    handleFieldChange,
    handleFieldValidation,
    handleSubmit,
    handleDelete,
  };
};
