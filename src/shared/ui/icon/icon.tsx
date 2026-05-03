import { type FC, type HTMLAttributes } from 'react';
import { useClassName } from '@shared/lib';
import { ICON_BLOCK } from './constants';
import './icon.less';

interface IIconProps extends Omit<
  HTMLAttributes<HTMLOrSVGElement>,
  'className'
> {
  component?: FC<{ className?: string }>;
}

export const Icon: FC<IIconProps> = ({ component: Icon, ...rest }) => {
  const className = useClassName({
    blockName: ICON_BLOCK,
  });

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      {...rest}
      className={className}
    />
  );
};
