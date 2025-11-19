import { type FC } from 'react';
import { useClassName } from '@shared/lib';
import type { IIconBaseProps, IIconProps } from './model';
import { ICON_BLOCK } from './lib';
import './icon.less';

const IconBase = ({ icon: Icon, className, ...rest }: IIconBaseProps) => (
  <Icon
    {...rest}
    className={className}
  />
);

export const Icon: FC<IIconProps> = ({ component, ...rest }) => {
  const className = useClassName({
    blockName: ICON_BLOCK,
  });

  if (!component) {
    return null;
  }

  return (
    <IconBase
      {...rest}
      className={className}
      icon={component}
    />
  );
};
