import { useCallback, type FC } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { useModalClose } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CardForm } from '../card-form';

interface ICardFormModalProps {
  initialCard?: IBankCard;
  onComplete?: Procedure;
}

export const CardFormModal: FC<ICardFormModalProps> = ({
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
