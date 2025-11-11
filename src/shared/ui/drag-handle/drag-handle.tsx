import { forwardRef, useMemo } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { bem, useClassName } from '@shared/lib';
import { DRAG_HANDLE_BLOCK, DRAG_HANDLE_ARIA_LABEL } from './lib/constants';
import type { IDragHandleProps } from './model/types';
import './drag-handle.less';

export const DragHandle = forwardRef<HTMLButtonElement, IDragHandleProps>(
  ({ isVisible, ...restProps }, ref) => {
    const modifiers = useMemo(() => {
      const result = [];

      if (isVisible) {
        result.push('visible');
      }

      return result;
    }, [isVisible]);

    const className = useClassName({
      blockName: DRAG_HANDLE_BLOCK,
      modifiers,
    });

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        aria-label={DRAG_HANDLE_ARIA_LABEL}
        {...restProps}
      >
        <MdDragIndicator
          className={bem(DRAG_HANDLE_BLOCK, 'icon')}
          aria-hidden="true"
        />
      </button>
    );
  }
);

DragHandle.displayName = 'DragHandle';
