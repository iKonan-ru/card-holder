import { type FC } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import {
  GroupBy,
  type ICardGroup,
  type TGroupBy,
} from '@features/card-management';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CARD_LIST_GROUP_BLOCK } from '../../constants';
import { CardListGrid } from '../card-list-grid';
import './card-list-group-section.less';

interface ICardListGroupSectionProps {
  group: ICardGroup;
  groupBy: TGroupBy;
  isCollapsed: boolean;
  onToggle: Procedure;
}

export const CardListGroupSection: FC<ICardListGroupSectionProps> = ({
  group,
  groupBy,
  isCollapsed,
  onToggle,
}) => {
  const className = useClassName({ blockName: CARD_LIST_GROUP_BLOCK });

  const chevronModifiers = [isCollapsed && 'collapsed'].filter(
    Boolean,
  ) as string[];
  const chevronClassName = bem(
    bem(CARD_LIST_GROUP_BLOCK, 'chevron'),
    chevronModifiers,
  );

  const contentModifiers = [!isCollapsed && 'expanded'].filter(
    Boolean,
  ) as string[];
  const contentClassName = bem(
    bem(CARD_LIST_GROUP_BLOCK, 'content'),
    contentModifiers,
  );

  const isPaymentSystemGroup = groupBy === GroupBy.PaymentSystem;
  const labelModifiers = [isPaymentSystemGroup && 'payment-system'].filter(
    Boolean,
  ) as string[];
  const labelClassName = bem(
    bem(CARD_LIST_GROUP_BLOCK, 'label'),
    labelModifiers,
  );

  return (
    <section className={className}>
      <ParentClassProvider parentClass={CARD_LIST_GROUP_BLOCK}>
        <button
          type="button"
          className={bem(CARD_LIST_GROUP_BLOCK, 'header')}
          onClick={onToggle}
          aria-expanded={!isCollapsed}
        >
          <FiChevronDown
            className={chevronClassName}
            aria-hidden="true"
          />
          <span className={labelClassName}>{group.label}</span>
          <span className={bem(CARD_LIST_GROUP_BLOCK, 'count')}>
            {group.cards.length}
          </span>
        </button>

        <div className={contentClassName}>
          <div className={bem(CARD_LIST_GROUP_BLOCK, 'content-inner')}>
            <CardListGrid
              cards={group.cards}
              isReorderMode={false}
              hideAddButton
            />
          </div>
        </div>
      </ParentClassProvider>
    </section>
  );
};
