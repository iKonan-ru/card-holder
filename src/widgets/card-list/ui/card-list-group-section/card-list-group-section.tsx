import { type FC } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import type { ICardGroup } from '@features/card-management';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CARD_LIST_GROUP_BLOCK } from '../../constants';
import { CardListGrid } from '../card-list-grid';
import './card-list-group-section.less';

interface ICardListGroupSectionProps {
  group: ICardGroup;
  isCollapsed: boolean;
  onToggle: Procedure;
}

export const CardListGroupSection: FC<ICardListGroupSectionProps> = ({
  group,
  isCollapsed,
  onToggle,
}) => {
  const className = useClassName({ blockName: CARD_LIST_GROUP_BLOCK });
  const ChevronIcon = isCollapsed ? FiChevronRight : FiChevronDown;

  return (
    <section className={className}>
      <ParentClassProvider parentClass={CARD_LIST_GROUP_BLOCK}>
        <button
          type="button"
          className={bem(CARD_LIST_GROUP_BLOCK, 'header')}
          onClick={onToggle}
          aria-expanded={!isCollapsed}
        >
          <ChevronIcon
            className={bem(CARD_LIST_GROUP_BLOCK, 'chevron')}
            aria-hidden="true"
          />
          <span className={bem(CARD_LIST_GROUP_BLOCK, 'label')}>
            {group.label}
          </span>
          <span className={bem(CARD_LIST_GROUP_BLOCK, 'count')}>
            {group.cards.length}
          </span>
        </button>

        {!isCollapsed && (
          <CardListGrid
            cards={group.cards}
            isReorderMode={false}
            hideAddButton
          />
        )}
      </ParentClassProvider>
    </section>
  );
};
