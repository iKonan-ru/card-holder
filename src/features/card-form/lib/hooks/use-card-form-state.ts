import { useCallback, useEffect, useState } from 'react';
import type { IBankCard } from '@entities/bank-card';
import type { Procedure } from '@shared/types';
import { EMPTY_CARD_FORM } from '../constants';
import { formatExpires, formatPan } from '../utils';

interface IUseCardFormStateParams {
  initialCard?: Partial<IBankCard>;
}

interface IUseCardFormStateResult {
  formData: Partial<IBankCard>;
  isSubmitting: boolean;
  setIsSubmitting: (value: ((prevState: boolean) => boolean) | boolean) => void;
  isEditMode: boolean;
  originalPan: string | undefined;
  handleFieldChange: (fieldName: string, value: string) => void;
  resetForm: Procedure;
}

export const useCardFormState = ({
  initialCard,
}: IUseCardFormStateParams): IUseCardFormStateResult => {
  const [formData, setFormData] = useState<Partial<IBankCard>>(EMPTY_CARD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialCard);
  const originalPan = initialCard?.pan;

  useEffect(() => {
    if (initialCard) {
      const formattedCard = {
        ...initialCard,
        pan: formatPan(initialCard.pan || ''),
        expires: formatExpires(initialCard.expires || ''),
      };

      setFormData(formattedCard);
    }
  }, [initialCard]);

  const handleFieldChange = useCallback((fieldName: string, value: string) => {
    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_CARD_FORM);
  }, []);

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    isEditMode,
    originalPan,
    handleFieldChange,
    resetForm,
  };
};
