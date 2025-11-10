import { useCallback } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { useModal } from '@shared/lib';
import { CardFormModalContent } from '../../ui/card-form-modal-content';
import { CARD_FORM_TITLE_ID } from '../constants';
import { useCardManagementStore } from '@features/card-management';

export const useCardFormModal = () => {
  const modal = useModal();
  const unflipCards = useCardManagementStore((state) => state.unflipCards);

  const openAddCardForm = useCallback(() => {
    modal.open(<CardFormModalContent />, CARD_FORM_TITLE_ID);
    unflipCards();
  }, [modal, unflipCards]);

  const openEditCardForm = useCallback(
    (card: IBankCard) => {
      modal.open(
        <CardFormModalContent initialCard={card} />,
        CARD_FORM_TITLE_ID
      );
    },
    [modal]
  );

  return {
    openAddCardForm,
    openEditCardForm,
  };
};
