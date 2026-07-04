import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  selectFilterFacetOptions,
  useCardsStore,
  useCardViewStore,
  type ICardFilters,
} from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { useOwnersManagementStore } from '@features/owners-management';

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

export interface IActiveFilterChip {
  facet: keyof ICardFilters;
  value: string;
  label: string;
}

export interface IUseFilterControlsResult {
  filterSections: IFilterSection[];
  activeFilterCount: number;
  activeFilterChips: IActiveFilterChip[];
  isFilterSheetOpen: boolean;
  handleOpenFilterSheet: () => void;
  handleCloseFilterSheet: () => void;
  handleFilterChange: (facet: keyof ICardFilters, next: string[]) => void;
  handleRemoveFilterValue: (facet: keyof ICardFilters, value: string) => void;
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

  const activeFilterChips = useMemo<IActiveFilterChip[]>(
    () =>
      filterSections.flatMap((section) =>
        section.selectedValues.map((value) => {
          const option = section.options.find((item) => item.value === value);

          return { facet: section.key, value, label: option?.label ?? value };
        }),
      ),
    [filterSections],
  );

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const handleOpenFilterSheet = useCallback(() => {
    setIsFilterSheetOpen(true);
  }, []);

  const handleCloseFilterSheet = useCallback(() => {
    setIsFilterSheetOpen(false);
  }, []);

  const handleFilterChange = useCallback(
    (facet: keyof ICardFilters, next: string[]) => {
      setFilters({ [facet]: next });
    },
    [setFilters],
  );

  const handleRemoveFilterValue = useCallback(
    (facet: keyof ICardFilters, value: string) => {
      const next = filters[facet].filter((item) => item !== value);

      setFilters({ [facet]: next });
    },
    [filters, setFilters],
  );

  return {
    filterSections,
    activeFilterCount,
    activeFilterChips,
    isFilterSheetOpen,
    handleOpenFilterSheet,
    handleCloseFilterSheet,
    handleFilterChange,
    handleRemoveFilterValue,
  };
};
