import { type FC } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import type { ICardFilters } from '@features/card-management';
import { bem, useClassName } from '@shared/lib';
import { CheckboxGroup } from '@shared/ui';
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

  const chevronModifiers = [isCollapsed && 'collapsed'].filter(
    Boolean,
  ) as string[];
  const chevronClassName = bem(
    bem(FILTER_FACET_GROUP_BLOCK, 'chevron'),
    chevronModifiers,
  );

  const contentModifiers = [!isCollapsed && 'expanded'].filter(
    Boolean,
  ) as string[];
  const contentClassName = bem(
    bem(FILTER_FACET_GROUP_BLOCK, 'content'),
    contentModifiers,
  );

  return (
    <div className={className}>
      <button
        type="button"
        className={bem(FILTER_FACET_GROUP_BLOCK, 'header')}
        onClick={handleToggle}
        aria-expanded={!isCollapsed}
      >
        <FiChevronDown
          className={chevronClassName}
          aria-hidden="true"
        />
        <span className={bem(FILTER_FACET_GROUP_BLOCK, 'title')}>
          {section.title}
        </span>
      </button>

      <div className={contentClassName}>
        <div className={bem(FILTER_FACET_GROUP_BLOCK, 'content-inner')}>
          <CheckboxGroup
            options={section.options}
            value={section.selectedValues}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
