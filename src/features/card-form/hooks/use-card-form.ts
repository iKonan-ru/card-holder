import type { SubmitEvent } from 'react';
import type { IBankCard } from '@entities/bank-card';
import type { Procedure } from '@shared/types';
import {
  CVV_MAX_LENGTH,
  EXPIRES_FORMATTED_LENGTH,
  MIN_NAME_LENGTH,
  PAN_FORMATTED_LENGTH,
} from '../constants';
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
  isSubmitEnabled: boolean;
  isEditMode: boolean;
  handleFieldChange: (fieldName: string, value: string) => void;
  handleFieldValidation: (
    fieldName: keyof IValidationErrors,
    error: string | undefined,
  ) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
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

  const isSubmitEnabled =
    !errors.pan &&
    (formData.pan?.length ?? 0) === PAN_FORMATTED_LENGTH &&
    !errors.expires &&
    (formData.expires?.length ?? 0) === EXPIRES_FORMATTED_LENGTH &&
    !errors.cvv &&
    (formData.cvv?.length ?? 0) === CVV_MAX_LENGTH &&
    !errors.name &&
    (formData.name?.trim().length ?? 0) >= MIN_NAME_LENGTH;

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitEnabled,
    isEditMode,
    handleFieldChange,
    handleFieldValidation,
    handleSubmit,
    handleDelete,
  };
};
