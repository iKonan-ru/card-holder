import { type FC } from 'react';
import { useClassName, ParentClassProvider } from '@shared/lib';
import { DragHandle } from '@shared/ui';
import { BankCard } from '@entities/bank-card';
import type { ICardListDragOverlayProps } from './model';
import { CARD_LIST_DRAG_OVERLAY_BLOCK } from './lib';
import './card-list-drag-overlay.less';

export const CardListDragOverlay: FC<ICardListDragOverlayProps> = ({
  activeCard,
  onEditCard,
}) => {
  const className = useClassName({
    blockName: CARD_LIST_DRAG_OVERLAY_BLOCK,
  });

  if (!activeCard) {
    return null;
  }

  return (
    <div className={className}>
      <ParentClassProvider parentClass={CARD_LIST_DRAG_OVERLAY_BLOCK}>
        <BankCard
          card={activeCard}
          onEdit={onEditCard}
          isReorderMode={true}
        />
        <DragHandle isVisible={true} />
      </ParentClassProvider>
    </div>
  );
};
