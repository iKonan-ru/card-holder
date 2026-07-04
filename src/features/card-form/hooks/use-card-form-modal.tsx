import { useCallback } from 'react';
import { useCardsStore } from '@features/card-management';
import type { IBankCard } from '@entities/bank-card';
import { useModal } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CARD_FORM_EDIT_TITLE, CARD_FORM_TITLE } from '../constants';
import { CardFormModal } from '../ui';

interface IUseCardFormModalResult {
  openAddCardForm: Procedure;
  openEditCardForm: (card: IBankCard) => void;
}

export const useCardFormModal = (): IUseCardFormModalResult => {
  const { open } = useModal();
  const unflipCards = useCardsStore((state) => state.unflipCards);

  const openAddCardForm = useCallback(() => {
    open(<CardFormModal />, CARD_FORM_TITLE);
    unflipCards();
  }, [open, unflipCards]);

  const openEditCardForm = useCallback(
    (card: IBankCard) => {
      open(<CardFormModal initialCard={card} />, CARD_FORM_EDIT_TITLE);
    },
    [open],
  );

  return {
    openAddCardForm,
    openEditCardForm,
  };
};
