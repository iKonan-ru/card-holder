import { type FC, useCallback } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { useModalClose } from '@shared/ui';
import { CardForm } from './card-form';

interface ICardFormModalContentProps {
  initialCard?: IBankCard;
  onComplete?: () => void;
}

export const CardFormModalContent: FC<ICardFormModalContentProps> = ({
  initialCard,
  onComplete,
}) => {
  const closeModal = useModalClose();

  const handleSuccess = useCallback(() => {
    closeModal();
    if (onComplete) {
      onComplete();
    }
  }, [closeModal, onComplete]);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <CardForm
      initialCard={initialCard}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};
