import { type FC } from 'react';
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

  const handleSuccess = () => {
    closeModal();
    if (onComplete) {
      onComplete();
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <CardForm
      initialCard={initialCard}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};
