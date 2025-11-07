import { useEffect } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { useCardManagementStore } from '@features/card-management';
import { useModal } from '@shared/lib';
import { CardForm, CARD_FORM_TITLE_ID } from '@features/card-form';

export const useCardList = () => {
  const {
    cards,
    flippedPan,
    isLoading,
    isReorderMode,
    loadCards,
    reorderCards,
    setCards,
    toggleReorderMode,
    unflipCards,
    flipCard,
  } = useCardManagementStore();
  const modal = useModal();

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleShowForm = () => {
    modal.open(
      <CardForm
        onSuccess={modal.close}
        onCancel={modal.close}
      />,
      () => {},
      CARD_FORM_TITLE_ID
    );
    unflipCards();
  };

  const handleEditCard = (card: IBankCard) => {
    modal.open(
      <CardForm
        initialCard={card}
        onSuccess={modal.close}
        onCancel={modal.close}
      />,
      () => {},
      CARD_FORM_TITLE_ID
    );
  };

  const handleDragEnd = (reorderedCards: IBankCard[]) => {
    setCards(reorderedCards);
    reorderCards(reorderedCards);
  };

  const handleToggleReorderMode = () => {
    toggleReorderMode();
  };

  const handleFlipCard = (pan: string) => {
    flipCard(pan);
  };

  return {
    cards,
    flippedPan,
    isLoading,
    isReorderMode,
    handleShowForm,
    handleEditCard,
    handleDragEnd,
    handleToggleReorderMode,
    handleFlipCard,
  };
};
