import { type FC } from 'react';
import { ExportButton, ImportButton } from '@features/card-export-import';
import { useCardManagementStore } from '@features/card-management';
import { ClearButton } from '@features/clear-button';
import { ReorderToggleButton } from '@features/reorder-toggle-button';
import { ParentClassProvider, useClassName } from '@shared/lib';
import { ACTION_BUTTONS_BLOCK } from '../constants';
import './action-buttons.less';

export const ActionButtons: FC = () => {
  const { cards, isReorderMode, toggleReorderMode } = useCardManagementStore();

  const hasCards = cards.length > 0;

  const handleToggleReorderMode = () => {
    toggleReorderMode();
  };

  const className = useClassName({
    blockName: ACTION_BUTTONS_BLOCK,
  });

  return (
    <div className={className}>
      <ParentClassProvider parentClass={ACTION_BUTTONS_BLOCK}>
        <ImportButton />

        {hasCards && (
          <>
            <ExportButton />
            <ReorderToggleButton
              isActive={isReorderMode}
              onClick={handleToggleReorderMode}
            />
            <ClearButton />
          </>
        )}
      </ParentClassProvider>
    </div>
  );
};
