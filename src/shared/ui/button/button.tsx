import {
  useMemo,
  type ButtonHTMLAttributes,
  type FC,
  type PropsWithChildren,
} from 'react';
import { FiLoader } from 'react-icons/fi';
import { bem, useClassName } from '@shared/lib';
import { BUTTON_BLOCK } from './constants';
import './button.less';

interface IButtonProps
  extends PropsWithChildren<
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
  > {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: FC<IButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  type = 'button',
  ...restProps
}) => {
  const modifiers = useMemo(() => {
    const result: string[] = [variant];

    if (fullWidth) {
      result.push('full-width');
    }

    return result;
  }, [variant, fullWidth]);

  const className = useClassName({
    blockName: BUTTON_BLOCK,
    modifiers,
  });

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled}
      {...restProps}
    >
      <span
        className={bem(bem(BUTTON_BLOCK, 'text'), isLoading ? ['hidden'] : [])}
      >
        {children}
      </span>
      {isLoading && (
        <FiLoader
          className={bem(BUTTON_BLOCK, 'loader')}
          aria-label="Загрузка"
        />
      )}
    </button>
  );
};
