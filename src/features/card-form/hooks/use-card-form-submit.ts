import { useCallback, type SubmitEvent } from 'react';
import { useCardManagementStore } from '@features/card-management';
import type { IBankCard } from '@entities/bank-card';
import {
  checkCardExists,
  ERROR_FAILED_TO_ADD_CARD,
  ERROR_FAILED_TO_DELETE_CARD,
  logError,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { ERROR_CARD_ALREADY_EXISTS } from '../constants';
import type { IValidationErrors } from '../types';
import {
  checkHasErrors,
  checkIsValidBankCard,
  filterDigitsOnly,
  validateCardForm,
} from '../utils';

interface IUseCardFormSubmitParams {
  formData: Partial<IBankCard>;
  isEditMode: boolean;
  originalPan?: string;
  setErrors: (errors: IValidationErrors) => void;
  setIsSubmitting: (value: boolean) => void;
  resetForm: Procedure;
  resetErrors: Procedure;
  onSuccess?: Procedure;
}

interface IUseCardFormSubmitResult {
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleDelete: () => Promise<void>;
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
}: IUseCardFormSubmitParams): IUseCardFormSubmitResult => {
  const { addCard, updateCard, deleteCard } = useCardManagementStore();

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      const cardDataToValidate: Partial<IBankCard> = {
        ...formData,
        pan: filterDigitsOnly(formData.pan || ''),
        expires: filterDigitsOnly(formData.expires || ''),
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

          if (isPanChanged && originalPan) {
            await deleteCard(originalPan);
          }
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
    ],
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
