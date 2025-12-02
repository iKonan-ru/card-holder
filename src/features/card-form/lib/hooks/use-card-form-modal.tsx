import { useCallback } from 'react';
import { useCardManagementStore } from '@features/card-management';
import type { IBankCard } from '@entities/bank-card';
import { useModal } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CardFormModal } from '../../ui';
import { CARD_FORM_EDIT_TITLE, CARD_FORM_TITLE } from '../constants';

interface IUseCardFormModalResult {
  openAddCardForm: Procedure;
  openEditCardForm: (card: IBankCard) => void;
}

export const useCardFormModal = (): IUseCardFormModalResult => {
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
