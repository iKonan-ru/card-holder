import { useCallback, type FC, type ReactElement } from 'react';
import { AddCardButton } from '@features/add-card-button';
import type { ICardGroup, TGroupBy } from '@features/card-management';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CARD_LIST_GROUPS_BLOCK } from '../../constants';
import { CardListEmptyState } from '../card-list-empty-state';
import { CardListGroupSection } from '../card-list-group-section';
import './card-list-groups.less';

interface ICardListGroupsProps {
  groups: ICardGroup[];
  groupBy: TGroupBy;
  collapsedGroups: string[];
  hasAnyCards: boolean;
  onToggleCollapse: (groupId: string) => void;
  onShowForm: Procedure;
}

export const CardListGroups: FC<ICardListGroupsProps> = ({
  groups,
  groupBy,
  collapsedGroups,
  hasAnyCards,
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
          groupBy={groupBy}
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
        />
      );
    },
    [groupBy, collapsedGroups, onToggleCollapse],
  );

  return (
    <div className={className}>
      <ParentClassProvider parentClass={CARD_LIST_GROUPS_BLOCK}>
        {showFilterEmptyState && <CardListEmptyState />}
        {groups.map(renderGroup)}
        <div className={bem(CARD_LIST_GROUPS_BLOCK, 'add-button')}>
          <AddCardButton onClick={onShowForm} />
        </div>
      </ParentClassProvider>
    </div>
  );
};
