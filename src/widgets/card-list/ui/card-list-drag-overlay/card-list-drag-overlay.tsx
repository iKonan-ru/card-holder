import { type FC } from 'react';
import { useCardTypeName } from '@features/card-management';
import { BankCard, type IBankCard } from '@entities/bank-card';
import { ParentClassProvider, useClassName } from '@shared/lib';
import { DragHandle } from '@shared/ui';
import { CARD_LIST_DRAG_OVERLAY_BLOCK } from '../../constants';
import './card-list-drag-overlay.less';

interface ICardListDragOverlayProps {
  activeCard: IBankCard | null;
}

export const CardListDragOverlay: FC<ICardListDragOverlayProps> = ({
  activeCard,
}) => {
  const typeName = useCardTypeName(activeCard?.typeId);
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
          isReorderMode={true}
          typeName={typeName}
        />
        <DragHandle isVisible={true} />
      </ParentClassProvider>
    </div>
  );
};
