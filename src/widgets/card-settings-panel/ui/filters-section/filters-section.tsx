import { useCallback, type FC, type ReactElement } from 'react';
import type { ICardFilters } from '@features/card-management';
import { FILTERS_SECTION_TITLE } from '../../constants';
import type { IFilterSection } from '../../hooks';
import { PanelSection } from '../panel-section';
import { FilterFacetGroup } from './filter-facet-group';

interface IFiltersSectionProps {
  sections: IFilterSection[];
  activeFilterCount: number;
  collapsedFacets: (keyof ICardFilters)[];
  onFilterChange: (facet: keyof ICardFilters, next: string[]) => void;
  onToggleFacetCollapse: (facet: keyof ICardFilters) => void;
}

export const FiltersSection: FC<IFiltersSectionProps> = ({
  sections,
  activeFilterCount,
  collapsedFacets,
  onFilterChange,
  onToggleFacetCollapse,
}) => {
  const renderSection = useCallback(
    (section: IFilterSection): ReactElement => (
      <FilterFacetGroup
        key={section.key}
        section={section}
        isCollapsed={collapsedFacets.includes(section.key)}
        onChange={onFilterChange}
        onToggleCollapse={onToggleFacetCollapse}
      />
    ),
    [collapsedFacets, onFilterChange, onToggleFacetCollapse],
  );

  return (
    <PanelSection
      title={FILTERS_SECTION_TITLE}
      badge={activeFilterCount}
    >
      {sections.map(renderSection)}
    </PanelSection>
  );
};
