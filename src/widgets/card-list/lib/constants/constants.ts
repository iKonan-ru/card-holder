import type { DropAnimation } from '@dnd-kit/core';

export const CARD_LIST_BLOCK = 'card-list';

export const DROP_ANIMATION_DURATION = 200;
export const DROP_ANIMATION_EASING = 'ease';

export const DROP_ANIMATION: DropAnimation = {
  duration: DROP_ANIMATION_DURATION,
  easing: DROP_ANIMATION_EASING,
};

export const POINTER_SENSOR_ACTIVATION_DISTANCE = 8;
export const TOUCH_SENSOR_ACTIVATION_DELAY = 200;
export const TOUCH_SENSOR_ACTIVATION_TOLERANCE = 5;

export const CARD_LIST_ARIA_LABEL = 'Список банковских карт';
