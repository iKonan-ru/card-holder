import { type FC } from 'react';
import type { TGroupBy } from '@features/card-management';
import { Select } from '@shared/ui';
import {
  GROUP_BY_OPTIONS,
  GROUP_BY_PLACEHOLDER,
  GROUP_SECTION_TITLE,
} from '../../constants';
import { PanelSection } from '../panel-section';

interface IGroupSectionProps {
  groupBy: TGroupBy;
  onGroupByChange: (value: string) => void;
}

export const GroupSection: FC<IGroupSectionProps> = ({
  groupBy,
  onGroupByChange,
}) => {
  return (
    <PanelSection title={GROUP_SECTION_TITLE}>
      <Select
        value={groupBy}
        options={GROUP_BY_OPTIONS}
        onChange={onGroupByChange}
        placeholder={GROUP_BY_PLACEHOLDER}
        ariaLabel={GROUP_BY_PLACEHOLDER}
      />
    </PanelSection>
  );
};
