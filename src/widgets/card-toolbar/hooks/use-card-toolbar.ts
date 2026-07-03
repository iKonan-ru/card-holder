import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  canReorder,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_KEY,
  SortDirection,
  useCardManagementStore,
  type ICardFilters,
  type TSortDirection,
  type TSortKey,
} from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { useOwnersManagementStore } from '@features/owners-management';
import { BANKS_LIST, PAYMENT_SYSTEM_LABELS } from '@shared/data';
import { getBankByCardNumber, getPaymentSystem } from '@shared/lib';
import {
  FILTER_SECTION_TITLE_BANK,
  FILTER_SECTION_TITLE_OWNER,
  FILTER_SECTION_TITLE_PAYMENT_SYSTEM,
  FILTER_SECTION_TITLE_TYPE,
} from '../constants';

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

interface IUseCardToolbarResult {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  isSortActive: boolean;
  handleSortKeyChange: (value: string) => void;
  handleToggleDirection: () => void;
  handleResetSort: () => void;
  filterSections: IFilterSection[];
  activeFilterCount: number;
  activeFilterChips: IActiveFilterChip[];
  isFilterSheetOpen: boolean;
  handleOpenFilterSheet: () => void;
  handleCloseFilterSheet: () => void;
  handleFilterChange: (facet: keyof ICardFilters, next: string[]) => void;
  handleRemoveFilterValue: (facet: keyof ICardFilters, value: string) => void;
  hasActiveModifiers: boolean;
  handleResetAll: () => void;
}

export const useCardToolbar = (): IUseCardToolbarResult => {
  const cards = useCardManagementStore((state) => state.cards);
  const sortKey = useCardManagementStore((state) => state.sortKey);
  const sortDirection = useCardManagementStore((state) => state.sortDirection);
  const groupBy = useCardManagementStore((state) => state.groupBy);
  const filters = useCardManagementStore((state) => state.filters);
  const setSortKey = useCardManagementStore((state) => state.setSortKey);
  const setSortDirection = useCardManagementStore(
    (state) => state.setSortDirection,
  );
  const setFilters = useCardManagementStore((state) => state.setFilters);
  const resetView = useCardManagementStore((state) => state.resetView);

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

  const isSortActive =
    sortKey !== DEFAULT_SORT_KEY || sortDirection !== DEFAULT_SORT_DIRECTION;

  const handleSortKeyChange = (value: string) => {
    setSortKey(value as TSortKey);
  };

  const handleToggleDirection = () => {
    const nextDirection =
      sortDirection === SortDirection.Asc
        ? SortDirection.Desc
        : SortDirection.Asc;

    setSortDirection(nextDirection);
  };

  const handleResetSort = () => {
    setSortKey(DEFAULT_SORT_KEY);
    setSortDirection(DEFAULT_SORT_DIRECTION);
  };

  const bankOptions = useMemo<IFilterOption[]>(() => {
    const bankIds = new Set<string>();

    cards.forEach((card) => {
      const bankId = getBankByCardNumber(card.pan);

      if (bankId) {
        bankIds.add(bankId);
      }
    });

    return Array.from(bankIds).map((bankId) => {
      const bank = BANKS_LIST.find((item) => item.id === bankId);

      return { value: bankId, label: bank?.name ?? bankId };
    });
  }, [cards]);

  const paymentSystemOptions = useMemo<IFilterOption[]>(() => {
    const systems = new Set<string>();

    cards.forEach((card) => {
      const paymentSystem = getPaymentSystem(card.pan);

      if (paymentSystem) {
        systems.add(paymentSystem);
      }
    });

    return Array.from(systems).map((system) => ({
      value: system,
      label:
        PAYMENT_SYSTEM_LABELS[system as keyof typeof PAYMENT_SYSTEM_LABELS],
    }));
  }, [cards]);

  const typeOptions = useMemo<IFilterOption[]>(
    () =>
      cardTypes.map((cardType) => ({
        value: cardType.id,
        label: cardType.name,
      })),
    [cardTypes],
  );

  const ownerOptions = useMemo<IFilterOption[]>(
    () => owners.map((owner) => ({ value: owner.id, label: owner.realName })),
    [owners],
  );

  const filterSections = useMemo<IFilterSection[]>(
    () => [
      {
        key: 'bankIds',
        title: FILTER_SECTION_TITLE_BANK,
        options: bankOptions,
        selectedValues: filters.bankIds,
      },
      {
        key: 'paymentSystems',
        title: FILTER_SECTION_TITLE_PAYMENT_SYSTEM,
        options: paymentSystemOptions,
        selectedValues: filters.paymentSystems,
      },
      {
        key: 'typeIds',
        title: FILTER_SECTION_TITLE_TYPE,
        options: typeOptions,
        selectedValues: filters.typeIds,
      },
      {
        key: 'ownerIds',
        title: FILTER_SECTION_TITLE_OWNER,
        options: ownerOptions,
        selectedValues: filters.ownerIds,
      },
    ],
    [bankOptions, paymentSystemOptions, typeOptions, ownerOptions, filters],
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

  const hasActiveModifiers = !canReorder({ sortKey, groupBy, filters });

  const handleResetAll = useCallback(() => {
    resetView();
  }, [resetView]);

  return {
    sortKey,
    sortDirection,
    isSortActive,
    handleSortKeyChange,
    handleToggleDirection,
    handleResetSort,
    filterSections,
    activeFilterCount,
    activeFilterChips,
    isFilterSheetOpen,
    handleOpenFilterSheet,
    handleCloseFilterSheet,
    handleFilterChange,
    handleRemoveFilterValue,
    hasActiveModifiers,
    handleResetAll,
  };
};
