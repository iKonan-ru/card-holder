import { type FC } from 'react';
import { bem } from '@shared/lib';
import { BankCard } from '@entities/bank-card';
import type { ICardListDragOverlayProps } from './model';

export const CardListDragOverlay: FC<ICardListDragOverlayProps> = ({
  activeCard,
  onEditCard,
  parentClass,
}) => {
  if (!activeCard) {
    return null;
  }

  return (
    <div className={bem(parentClass, 'drag-overlay')}>
      <BankCard
        card={activeCard}
        onEdit={onEditCard}
        parentClass={parentClass}
        isReorderMode={true}
      />
    </div>
  );
};
