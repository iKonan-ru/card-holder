import { useMemo, type FC, type PropsWithChildren } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ParentClassProvider, useClassName } from '@shared/lib';
import { DragHandle } from '@shared/ui';
import {
  SORTABLE_CARD_ITEM_BLOCK,
  SORTABLE_CARD_ITEM_DEFAULT_OPACITY,
  SORTABLE_CARD_ITEM_DRAGGING_OPACITY,
} from '../constants';
import './sortable-card-item.less';

export interface ISortableCardItemProps extends PropsWithChildren {
  id: string;
  isReorderMode: boolean;
}

export const SortableCardItem: FC<ISortableCardItemProps> = ({
  id,
  isReorderMode,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    index,
  } = useSortable({
    id,
    disabled: !isReorderMode,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition,
    opacity: isDragging
      ? SORTABLE_CARD_ITEM_DRAGGING_OPACITY
      : SORTABLE_CARD_ITEM_DEFAULT_OPACITY,
  };

  const modifiers = useMemo(() => {
    const result = [];

    if (isDragging) {
      result.push('dragging');
    }

    if (isReorderMode) {
      result.push('reorder');
    }

    return result;
  }, [isDragging, isReorderMode]);

  const className = useClassName({
    blockName: SORTABLE_CARD_ITEM_BLOCK,
    modifiers,
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      tabIndex={index}
    >
      <ParentClassProvider parentClass={SORTABLE_CARD_ITEM_BLOCK}>
        {children}
        <DragHandle
          ref={setActivatorNodeRef}
          isVisible={isReorderMode}
          {...listeners}
        />
      </ParentClassProvider>
    </div>
  );
};
