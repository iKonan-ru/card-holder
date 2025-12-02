import { forwardRef, useMemo, type ButtonHTMLAttributes } from 'react';
import { FiMove } from 'react-icons/fi';
import { bem, useClassName } from '@shared/lib';
import { DRAG_HANDLE_ARIA_LABEL, DRAG_HANDLE_BLOCK } from './lib';
import './drag-handle.less';

interface IDragHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isVisible: boolean;
}

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
        <FiMove
          className={bem(DRAG_HANDLE_BLOCK, 'icon')}
          aria-hidden="true"
        />
      </button>
    );
  }
);

DragHandle.displayName = 'DragHandle';
