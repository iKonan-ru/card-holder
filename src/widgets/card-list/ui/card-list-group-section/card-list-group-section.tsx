import { type FC } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import type { ICardGroup } from '@features/card-management';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import {
  CARD_LIST_GROUP_BLOCK,
  CARD_LIST_GROUP_COLLAPSE_ARIA_LABEL_COLLAPSED,
  CARD_LIST_GROUP_COLLAPSE_ARIA_LABEL_EXPANDED,
} from '../../constants';
import { CardListGrid } from '../card-list-grid';
import './card-list-group-section.less';

interface ICardListGroupSectionProps {
  group: ICardGroup;
  isCollapsed: boolean;
  flippedPan: string | null;
  onToggle: Procedure;
}

export const CardListGroupSection: FC<ICardListGroupSectionProps> = ({
  group,
  isCollapsed,
  flippedPan,
  onToggle,
}) => {
  const className = useClassName({ blockName: CARD_LIST_GROUP_BLOCK });
  const ChevronIcon = isCollapsed ? FiChevronRight : FiChevronDown;
  const collapseAriaLabel = isCollapsed
    ? CARD_LIST_GROUP_COLLAPSE_ARIA_LABEL_COLLAPSED
    : CARD_LIST_GROUP_COLLAPSE_ARIA_LABEL_EXPANDED;

  return (
    <section className={className}>
      <ParentClassProvider parentClass={CARD_LIST_GROUP_BLOCK}>
        <button
          type="button"
          className={bem(CARD_LIST_GROUP_BLOCK, 'header')}
          onClick={onToggle}
          aria-expanded={!isCollapsed}
          aria-label={collapseAriaLabel}
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
            flippedPan={flippedPan}
            isReorderMode={false}
            hideAddButton
          />
        )}
      </ParentClassProvider>
    </section>
  );
};
