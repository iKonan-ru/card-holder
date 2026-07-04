import { useCallback, type FC, type ReactElement } from 'react';
import type { ICardFilters } from '@features/card-management';
import { FILTERS_SECTION_TITLE } from '../../constants';
import type { IFilterSection } from '../../hooks';
import { PanelSection } from '../panel-section';
import { FilterFacetGroup } from './filter-facet-group';

interface IFiltersSectionProps {
  sections: IFilterSection[];
  activeFilterCount: number;
  onFilterChange: (facet: keyof ICardFilters, next: string[]) => void;
}

export const FiltersSection: FC<IFiltersSectionProps> = ({
  sections,
  activeFilterCount,
  onFilterChange,
}) => {
  const renderSection = useCallback(
    (section: IFilterSection): ReactElement => (
      <FilterFacetGroup
        key={section.key}
        section={section}
        onChange={onFilterChange}
      />
    ),
    [onFilterChange],
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
