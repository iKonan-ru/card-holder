import type { IBankCard } from '@entities/bank-card';
import { useCardFormState } from './use-card-form-state';
import { useCardFormValidation } from './use-card-form-validation';
import { useCardFormSubmit } from './use-card-form-submit';

interface IUseCardFormOptions {
  initialCard?: Partial<IBankCard>;
  onSuccess?: () => void;
}

export const useCardForm = ({
  initialCard,
  onSuccess,
}: IUseCardFormOptions = {}) => {
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

  const handleReset = () => {
    resetForm();
    resetErrors();
  };

  return {
    formData,
    errors,
    isSubmitting,
    isEditMode,
    handleFieldChange,
    handleFieldValidation,
    handleSubmit,
    handleDelete,
    handleReset,
  };
};
