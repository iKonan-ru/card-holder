import { useCallback, type FC, type ReactElement } from 'react';
import { AddCardButton } from '@features/add-card-button';
import type { ICardGroup } from '@features/card-management';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import {
  CARD_LIST_FILTER_EMPTY_MESSAGE,
  CARD_LIST_GROUPS_BLOCK,
} from '../../constants';
import { CardListGroupSection } from '../card-list-group-section';
import './card-list-groups.less';

interface ICardListGroupsProps {
  groups: ICardGroup[];
  collapsedGroups: string[];
  hasAnyCards: boolean;
  flippedPan: string | null;
  onToggleCollapse: (groupId: string) => void;
  onShowForm: Procedure;
}

export const CardListGroups: FC<ICardListGroupsProps> = ({
  groups,
  collapsedGroups,
  hasAnyCards,
  flippedPan,
  onToggleCollapse,
  onShowForm,
}) => {
  const className = useClassName({ blockName: CARD_LIST_GROUPS_BLOCK });
  const showFilterEmptyState = hasAnyCards && groups.length === 0;

  const renderGroup = useCallback(
    (group: ICardGroup): ReactElement => {
      const isCollapsed = collapsedGroups.includes(group.id);

      const handleToggle = () => {
        onToggleCollapse(group.id);
      };

      return (
        <CardListGroupSection
          key={group.id}
          group={group}
          isCollapsed={isCollapsed}
          flippedPan={flippedPan}
          onToggle={handleToggle}
        />
      );
    },
    [collapsedGroups, flippedPan, onToggleCollapse],
  );

  return (
    <div className={className}>
      <ParentClassProvider parentClass={CARD_LIST_GROUPS_BLOCK}>
        {showFilterEmptyState && (
          <div className={bem(CARD_LIST_GROUPS_BLOCK, 'empty-state')}>
            {CARD_LIST_FILTER_EMPTY_MESSAGE}
          </div>
        )}
        {groups.map(renderGroup)}
        <div className={bem(CARD_LIST_GROUPS_BLOCK, 'add-button')}>
          <AddCardButton onClick={onShowForm} />
        </div>
      </ParentClassProvider>
    </div>
  );
};
