import { useMemo, type FC } from 'react';
import {
  useSortable,
  defaultAnimateLayoutChanges,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { bem, useParentClass, ParentClassProvider } from '@shared/lib';
import {
  SORTABLE_CARD_ITEM_BLOCK,
  SORTABLE_CARD_ITEM_TRANSFORM_DURATION,
  SORTABLE_CARD_ITEM_TRANSFORM_EASING,
  SORTABLE_CARD_ITEM_OPACITY_DURATION,
  SORTABLE_CARD_ITEM_OPACITY_EASING,
  SORTABLE_CARD_ITEM_DRAGGING_OPACITY,
  SORTABLE_CARD_ITEM_DEFAULT_OPACITY,
} from './lib';
import type { ISortableCardItemProps } from './model';
import './sortable-card-item.less';

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;

  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

export const SortableCardItem: FC<ISortableCardItemProps> = ({
  id,
  isReorderMode,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !isReorderMode,
    animateLayoutChanges,
  });

  const parentClass = useParentClass();

  const defaultTransition =
    `transform ${SORTABLE_CARD_ITEM_TRANSFORM_DURATION}ms` +
    `${SORTABLE_CARD_ITEM_TRANSFORM_EASING}, ` +
    `opacity ${SORTABLE_CARD_ITEM_OPACITY_DURATION}ms ` +
    `${SORTABLE_CARD_ITEM_OPACITY_EASING}`;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || defaultTransition,
    opacity: isDragging
      ? SORTABLE_CARD_ITEM_DRAGGING_OPACITY
      : SORTABLE_CARD_ITEM_DEFAULT_OPACITY,
  };

  const className = useMemo(() => {
    const modifiers = [];

    if (isDragging) {
      modifiers.push('dragging');
    }

    if (isReorderMode) {
      modifiers.push('reorder');
    }

    const wrapperClass = bem(
      bem(SORTABLE_CARD_ITEM_BLOCK, 'wrapper'),
      modifiers
    );
    const parentElementClass = parentClass
      ? bem(parentClass, SORTABLE_CARD_ITEM_BLOCK)
      : '';

    return [wrapperClass, parentElementClass].filter(Boolean).join(' ');
  }, [isDragging, isReorderMode, parentClass]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
    >
      <ParentClassProvider parentClass={SORTABLE_CARD_ITEM_BLOCK}>
        {children}
      </ParentClassProvider>
    </div>
  );
};
