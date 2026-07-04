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

interface IUseCardSettingsPanelResult
  extends
    IUseSortControlsResult,
    IUseGroupControlsResult,
    IUseFilterControlsResult {
  hasActiveModifiers: boolean;
  handleResetAll: () => void;
}

export const useCardSettingsPanel = (): IUseCardSettingsPanelResult => {
  const sortControls = useSortControls();
  const groupControls = useGroupControls();
  const filterControls = useFilterControls();

  const filters = useCardViewStore((state) => state.filters);
  const resetView = useCardViewStore((state) => state.resetView);

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
    hasActiveModifiers,
    handleResetAll,
  };
};
