import { useEffect, useMemo, useState } from 'react';
import {
  selectFilterFacetOptions,
  useCardsStore,
  useCardViewStore,
  type ICardFilters,
} from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { useOwnersManagementStore } from '@features/owners-management';

const INITIAL_COLLAPSED_FACETS: (keyof ICardFilters)[] = [];

export interface IFilterOption {
  value: string;
  label: string;
}

export interface IFilterSection {
  key: keyof ICardFilters;
  title: string;
  options: IFilterOption[];
  selectedValues: string[];
}

export interface IUseFilterControlsResult {
  filterSections: IFilterSection[];
  activeFilterCount: number;
  collapsedFacets: (keyof ICardFilters)[];
  handleFilterChange: (facet: keyof ICardFilters, next: string[]) => void;
  handleToggleFacetCollapse: (facet: keyof ICardFilters) => void;
}

export const useFilterControls = (): IUseFilterControlsResult => {
  const cards = useCardsStore((state) => state.cards);
  const filters = useCardViewStore((state) => state.filters);
  const setFilters = useCardViewStore((state) => state.setFilters);

  const cardTypes = useCardTypesManagementStore((state) => state.cardTypes);
  const loadCardTypes = useCardTypesManagementStore(
    (state) => state.loadCardTypes,
  );
  const owners = useOwnersManagementStore((state) => state.owners);
  const loadOwners = useOwnersManagementStore((state) => state.loadOwners);

  useEffect(() => {
    loadCardTypes();
    loadOwners();
  }, [loadCardTypes, loadOwners]);

  const facetOptions = useMemo(
    () => selectFilterFacetOptions(cards, { cardTypes, owners }),
    [cards, cardTypes, owners],
  );

  const filterSections = useMemo<IFilterSection[]>(
    () =>
      facetOptions.map((facet) => ({
        key: facet.key,
        title: facet.title,
        options: facet.options,
        selectedValues: filters[facet.key],
      })),
    [facetOptions, filters],
  );

  const activeFilterCount = useMemo(
    () =>
      filterSections.reduce(
        (total, section) => total + section.selectedValues.length,
        0,
      ),
    [filterSections],
  );

  const handleFilterChange = (facet: keyof ICardFilters, next: string[]) => {
    setFilters({ [facet]: next });
  };

  const [collapsedFacets, setCollapsedFacets] = useState<
    (keyof ICardFilters)[]
  >(INITIAL_COLLAPSED_FACETS);

  const handleToggleFacetCollapse = (facet: keyof ICardFilters) => {
    setCollapsedFacets((prev) => {
      const isCollapsed = prev.includes(facet);

      if (isCollapsed) {
        return prev.filter((item) => item !== facet);
      }

      return [...prev, facet];
    });
  };

  return {
    filterSections,
    activeFilterCount,
    collapsedFacets,
    handleFilterChange,
    handleToggleFacetCollapse,
  };
};
