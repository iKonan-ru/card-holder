import type { DropAnimation } from '@dnd-kit/core';
import { defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { SORTABLE_CARD_ITEM_DRAGGING_OPACITY } from '@shared/ui/sortable-card-item/lib';
import { DROP_ANIMATION_DURATION, DROP_ANIMATION_EASING } from '../constants';

export const DROP_ANIMATION: DropAnimation = {
  duration: DROP_ANIMATION_DURATION,
  easing: DROP_ANIMATION_EASING,
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: SORTABLE_CARD_ITEM_DRAGGING_OPACITY.toString(),
      },
    },
  }),
};
