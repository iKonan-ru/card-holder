import { type FC } from 'react';
import type { TSortDirection, TSortKey } from '@features/card-management';
import { Select } from '@shared/ui';
import {
  SORT_KEY_OPTIONS,
  SORT_KEY_PLACEHOLDER,
  SORT_SECTION_TITLE,
} from '../../constants';
import { PanelSection } from '../panel-section';
import { SortDirectionToggle } from '../sort-direction-toggle';

interface ISortSectionProps {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  isDirectionDisabled: boolean;
  onSortKeyChange: (value: string) => void;
  onDirectionChange: (direction: TSortDirection) => void;
}

export const SortSection: FC<ISortSectionProps> = ({
  sortKey,
  sortDirection,
  isDirectionDisabled,
  onSortKeyChange,
  onDirectionChange,
}) => {
  return (
    <PanelSection title={SORT_SECTION_TITLE}>
      <Select
        value={sortKey}
        options={SORT_KEY_OPTIONS}
        onChange={onSortKeyChange}
        placeholder={SORT_KEY_PLACEHOLDER}
        ariaLabel={SORT_KEY_PLACEHOLDER}
      />
      <SortDirectionToggle
        value={sortDirection}
        disabled={isDirectionDisabled}
        onChange={onDirectionChange}
      />
    </PanelSection>
  );
};
