import { type FC } from 'react';
import { PWAButton } from '@widgets/pwa-button';
import { ExportButton, ImportButton } from '@features/card-export-import';
import {
  canReorder,
  useCardsStore,
  useCardViewStore,
} from '@features/card-management';
import { CardSettingsToggleButton } from '@features/card-settings';
import { ClearButton } from '@features/clear-button';
import { ReorderToggleButton } from '@features/reorder-toggle-button';
import { ParentClassProvider, useClassName } from '@shared/lib';
import { ACTION_BUTTONS_BLOCK } from '../constants';
import './action-buttons.less';

export const ActionButtons: FC = () => {
  const cards = useCardsStore((state) => state.cards);
  const isReorderMode = useCardsStore((state) => state.isReorderMode);
  const toggleReorderMode = useCardsStore((state) => state.toggleReorderMode);
  const sortKey = useCardViewStore((state) => state.sortKey);
  const groupBy = useCardViewStore((state) => state.groupBy);
  const filters = useCardViewStore((state) => state.filters);

  const hasCards = cards.length > 0;
  const isReorderAllowed = canReorder({ sortKey, groupBy, filters });

  const handleToggleReorderMode = () => {
    toggleReorderMode();
  };

  const className = useClassName({
    blockName: ACTION_BUTTONS_BLOCK,
  });

  return (
    <div className={className}>
      <ParentClassProvider parentClass={ACTION_BUTTONS_BLOCK}>
        {hasCards && <CardSettingsToggleButton />}

        <ImportButton />

        {hasCards && (
          <>
            <ExportButton />
            <ReorderToggleButton
              isActive={isReorderMode}
              disabled={!isReorderAllowed}
              onClick={handleToggleReorderMode}
            />
            <ClearButton />
          </>
        )}

        <PWAButton />
      </ParentClassProvider>
    </div>
  );
};
