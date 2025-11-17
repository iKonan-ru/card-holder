import { type FC } from 'react';
import { useClassName, ParentClassProvider } from '@shared/lib';
import { ACTION_BUTTONS_CONTAINER_BLOCK } from './lib';
import { type IActionButtonsContainerProps } from './model';
import './action-buttons-container.less';

export const ActionButtonsContainer: FC<IActionButtonsContainerProps> = ({
  children,
}) => {
  const className = useClassName({
    blockName: ACTION_BUTTONS_CONTAINER_BLOCK,
  });

  return (
    <div className={className}>
      <ParentClassProvider parentClass={ACTION_BUTTONS_CONTAINER_BLOCK}>
        {children}
      </ParentClassProvider>
    </div>
  );
};
