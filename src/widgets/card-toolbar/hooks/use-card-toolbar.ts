import { canReorder, useCardViewStore } from '@features/card-management';
import {
  useFilterControls,
  type IUseFilterControlsResult,
} from './use-filter-controls';
import {
  useGroupControls,
  type IUseGroupControlsResult,
} from './use-group-controls';
import {
  useSortControls,
  type IUseSortControlsResult,
} from './use-sort-controls';

interface IUseCardToolbarResult
  extends
    IUseSortControlsResult,
    IUseGroupControlsResult,
    IUseFilterControlsResult {
  hasChipsRow: boolean;
  hasActiveModifiers: boolean;
  handleResetAll: () => void;
}

export const useCardToolbar = (): IUseCardToolbarResult => {
  const sortControls = useSortControls();
  const groupControls = useGroupControls();
  const filterControls = useFilterControls();

  const filters = useCardViewStore((state) => state.filters);
  const resetView = useCardViewStore((state) => state.resetView);

  const hasChipsRow =
    sortControls.isSortActive ||
    groupControls.isGroupActive ||
    filterControls.activeFilterChips.length > 0;

  const hasActiveModifiers = !canReorder({
    sortKey: sortControls.sortKey,
    groupBy: groupControls.groupBy,
    filters,
  });

  const handleResetAll = () => {
    resetView();
  };

  return {
    ...sortControls,
    ...groupControls,
    ...filterControls,
    hasChipsRow,
    hasActiveModifiers,
    handleResetAll,
  };
};
