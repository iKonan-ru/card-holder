import { type FC } from 'react';
import {
  GroupBy,
  type ICardGroup,
  type TGroupBy,
} from '@features/card-management';
import {
  bem,
  buildModifiers,
  ParentClassProvider,
  useClassName,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CollapsibleSection } from '@shared/ui';
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

  const isPaymentSystemGroup = groupBy === GroupBy.PaymentSystem;
  const labelModifiers = buildModifiers(
    isPaymentSystemGroup && 'payment-system',
  );
  const labelClassName = bem(
    bem(CARD_LIST_GROUP_BLOCK, 'label'),
    labelModifiers,
  );

  return (
    <section className={className}>
      <ParentClassProvider parentClass={CARD_LIST_GROUP_BLOCK}>
        <CollapsibleSection
          blockName={CARD_LIST_GROUP_BLOCK}
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          label={<span className={labelClassName}>{group.label}</span>}
          headerExtra={
            <span className={bem(CARD_LIST_GROUP_BLOCK, 'count')}>
              {group.cards.length}
            </span>
          }
        >
          <CardListGrid
            cards={group.cards}
            isReorderMode={false}
            hideAddButton
          />
        </CollapsibleSection>
      </ParentClassProvider>
    </section>
  );
};
