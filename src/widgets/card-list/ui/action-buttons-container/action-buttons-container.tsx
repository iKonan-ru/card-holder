import { type FC, type ReactNode } from 'react';
import { createClassName } from '@shared/lib';
import type { PropsWithParentClass } from '@shared/types';
import { ACTION_BUTTONS_CONTAINER_BLOCK } from './lib/constants';
import './action-buttons-container.less';

interface IActionButtonsContainerProps extends PropsWithParentClass {
  children: ReactNode;
}

export const ActionButtonsContainer: FC<IActionButtonsContainerProps> = ({
  children,
  parentClass,
}) => {
  const className = createClassName({
    blockName: ACTION_BUTTONS_CONTAINER_BLOCK,
    parentClass,
  });

  return <div className={className}>{children}</div>;
};
