import { type FC, useCallback } from 'react';
import { useModalClose } from '@shared/ui';
import type { ICardFormModalContentProps } from './model';
import { CardForm } from './card-form';

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
