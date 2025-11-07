import { useState, useCallback, useEffect } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { formatPan, formatExpires, EMPTY_CARD_FORM } from '..';

interface IUseCardFormStateParams {
  initialCard?: Partial<IBankCard>;
}

export const useCardFormState = ({ initialCard }: IUseCardFormStateParams) => {
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
