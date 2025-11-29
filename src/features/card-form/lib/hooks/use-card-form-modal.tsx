import { useCallback } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { useModal } from '@shared/lib';
import { useCardManagementStore } from '@features/card-management';
import { CardFormModal } from '../../ui';
import { CARD_FORM_TITLE, CARD_FORM_EDIT_TITLE } from '../constants';

export const useCardFormModal = () => {
  const modal = useModal();
  const unflipCards = useCardManagementStore((state) => state.unflipCards);

  const openAddCardForm = useCallback(() => {
    modal.open(<CardFormModal />, CARD_FORM_TITLE);
    unflipCards();
  }, [modal, unflipCards]);

  const openEditCardForm = useCallback(
    (card: IBankCard) => {
      modal.open(<CardFormModal initialCard={card} />, CARD_FORM_EDIT_TITLE);
    },
    [modal]
  );

  return {
    openAddCardForm,
    openEditCardForm,
  };
};
