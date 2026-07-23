import { type FC } from 'react';
import type { ICardFilters } from '@features/card-management';
import { bem, useClassName } from '@shared/lib';
import { CheckboxGroup, CollapsibleSection } from '@shared/ui';
import type { IFilterSection } from '../../hooks';
import { FILTER_FACET_GROUP_BLOCK } from './constants';
import './filter-facet-group.less';

interface IFilterFacetGroupProps {
  section: IFilterSection;
  isCollapsed: boolean;
  onChange: (facet: keyof ICardFilters, next: string[]) => void;
  onToggleCollapse: (facet: keyof ICardFilters) => void;
}

export const FilterFacetGroup: FC<IFilterFacetGroupProps> = ({
  section,
  isCollapsed,
  onChange,
  onToggleCollapse,
}) => {
  const className = useClassName({ blockName: FILTER_FACET_GROUP_BLOCK });

  const handleChange = (next: string[]) => {
    onChange(section.key, next);
  };

  const handleToggle = () => {
    onToggleCollapse(section.key);
  };

  return (
    <div className={className}>
      <CollapsibleSection
        blockName={FILTER_FACET_GROUP_BLOCK}
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        label={
          <span className={bem(FILTER_FACET_GROUP_BLOCK, 'title')}>
            {section.title}
          </span>
        }
      >
        <CheckboxGroup
          options={section.options}
          value={section.selectedValues}
          onChange={handleChange}
        />
      </CollapsibleSection>
    </div>
  );
};
