import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  POINTER_SENSOR_ACTIVATION_DISTANCE,
  TOUCH_SENSOR_ACTIVATION_DELAY,
  TOUCH_SENSOR_ACTIVATION_TOLERANCE,
} from '../constants';

export const useDndSensors = () => {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_SENSOR_ACTIVATION_DISTANCE,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: TOUCH_SENSOR_ACTIVATION_DELAY,
        tolerance: TOUCH_SENSOR_ACTIVATION_TOLERANCE,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
};
