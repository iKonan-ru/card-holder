import { useCallback, type FormEvent } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { useCardManagementStore } from '@features/card-management';
import {
  checkCardExists,
  logError,
  ERROR_FAILED_TO_ADD_CARD,
  ERROR_FAILED_TO_DELETE_CARD,
} from '@shared/lib';
import {
  validateCardForm,
  checkHasErrors,
  checkIsValidBankCard,
  unformatValue,
  type IValidationErrors,
  ERROR_CARD_ALREADY_EXISTS,
} from '..';

interface IUseCardFormSubmitParams {
  formData: Partial<IBankCard>;
  isEditMode: boolean;
  originalPan?: string;
  setErrors: (errors: IValidationErrors) => void;
  setIsSubmitting: (value: boolean) => void;
  resetForm: () => void;
  resetErrors: () => void;
  onSuccess?: () => void;
}

export const useCardFormSubmit = ({
  formData,
  isEditMode,
  originalPan,
  setErrors,
  setIsSubmitting,
  resetForm,
  resetErrors,
  onSuccess,
}: IUseCardFormSubmitParams) => {
  const { addCard, updateCard, deleteCard } = useCardManagementStore();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const cardDataToValidate: Partial<IBankCard> = {
        ...formData,
        pan: unformatValue(formData.pan || ''),
        expires: unformatValue(formData.expires || ''),
      };

      const validationErrors = validateCardForm(cardDataToValidate);
      const hasValidationErrors = checkHasErrors(validationErrors);

      if (hasValidationErrors) {
        setErrors(validationErrors);

        return;
      }

      setIsSubmitting(true);

      try {
        const cardPan = cardDataToValidate.pan || '';

        if (!isEditMode) {
          const cardExists = await checkCardExists(cardPan);

          if (cardExists) {
            setErrors({ pan: ERROR_CARD_ALREADY_EXISTS });
            setIsSubmitting(false);

            return;
          }

          const cardWithOrder = {
            ...cardDataToValidate,
            order: 0,
          };

          if (!checkIsValidBankCard(cardWithOrder)) {
            setIsSubmitting(false);

            return;
          }

          await addCard(cardWithOrder);
        } else {
          const isPanChanged = cardPan !== originalPan;

          if (isPanChanged) {
            const cardExists = await checkCardExists(cardPan);

            if (cardExists) {
              setErrors({ pan: ERROR_CARD_ALREADY_EXISTS });
              setIsSubmitting(false);

              return;
            }

            if (originalPan) {
              await deleteCard(originalPan);
            }
          }

          const cardWithOrder: Partial<IBankCard> & { order: number } = {
            ...cardDataToValidate,
            order: cardDataToValidate.order ?? 0,
          };

          if (!checkIsValidBankCard(cardWithOrder)) {
            setIsSubmitting(false);

            return;
          }

          await updateCard(cardWithOrder);
        }

        resetForm();
        resetErrors();

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        logError({
          message: ERROR_FAILED_TO_ADD_CARD,
          error,
          context: 'CardFormSubmit',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      isEditMode,
      originalPan,
      addCard,
      updateCard,
      deleteCard,
      setErrors,
      setIsSubmitting,
      resetForm,
      resetErrors,
      onSuccess,
    ]
  );

  const handleDelete = useCallback(async () => {
    if (!originalPan) {
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteCard(originalPan);
      resetForm();
      resetErrors();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      logError({
        message: ERROR_FAILED_TO_DELETE_CARD,
        error,
        context: 'CardFormDelete',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    originalPan,
    deleteCard,
    setIsSubmitting,
    resetForm,
    resetErrors,
    onSuccess,
  ]);

  return {
    handleSubmit,
    handleDelete,
  };
};
