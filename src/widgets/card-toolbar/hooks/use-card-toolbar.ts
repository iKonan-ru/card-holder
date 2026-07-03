import {
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_KEY,
  SortDirection,
  useCardManagementStore,
  type TSortDirection,
  type TSortKey,
} from '@features/card-management';

interface IUseCardToolbarResult {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  isSortActive: boolean;
  handleSortKeyChange: (value: string) => void;
  handleToggleDirection: () => void;
  handleResetSort: () => void;
}

export const useCardToolbar = (): IUseCardToolbarResult => {
  const sortKey = useCardManagementStore((state) => state.sortKey);
  const sortDirection = useCardManagementStore((state) => state.sortDirection);
  const setSortKey = useCardManagementStore((state) => state.setSortKey);
  const setSortDirection = useCardManagementStore(
    (state) => state.setSortDirection,
  );

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

  return {
    sortKey,
    sortDirection,
    isSortActive,
    handleSortKeyChange,
    handleToggleDirection,
    handleResetSort,
  };
};
