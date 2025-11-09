import { type FC, type ReactNode } from 'react';
import { useClassName, ParentClassProvider } from '@shared/lib';
import { ACTION_BUTTONS_CONTAINER_BLOCK } from './lib/constants';
import './action-buttons-container.less';

interface IActionButtonsContainerProps {
  children: ReactNode;
}

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
