import { type ComponentType, type FC, type HTMLAttributes } from 'react';
import { useClassName } from '@shared/lib';
import { ICON_BLOCK } from './lib';
import './icon.less';

interface IIconBaseProps extends HTMLAttributes<HTMLOrSVGElement> {
  icon: ComponentType<{ className?: string }>;
}

const IconBase = ({ icon: Icon, className, ...rest }: IIconBaseProps) => (
  <Icon
    {...rest}
    className={className}
  />
);

interface IIconProps
  extends Omit<HTMLAttributes<HTMLOrSVGElement>, 'className'> {
  component?: FC<{ className?: string }>;
}

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
