import type { HTMLAttributes, ComponentType, FC } from 'react';

export interface IIconBaseProps extends HTMLAttributes<HTMLOrSVGElement> {
  icon: ComponentType<{ className?: string }>;
}

export interface IIconProps
  extends Omit<HTMLAttributes<HTMLOrSVGElement>, 'className'> {
  component?: FC<{ className?: string }>;
}
