import { canReorder } from '../lib';
import type { ICardFilters } from '../types/view';
import { useCardsStore } from './cards-store';
import type { TGroupBy, TSortKey } from './view';

interface IReorderGuardParams {
  sortKey: TSortKey;
  groupBy: TGroupBy;
  filters: ICardFilters;
}

// Сбрасывает режим перестановки карт (живёт в cards-store), если новое
// состояние отображения (sort/group/filter, живёт в card-view-store) больше
// его не допускает.
export const resetReorderModeIfNeeded = (next: IReorderGuardParams): void => {
  const { isReorderMode } = useCardsStore.getState();

  if (!isReorderMode) {
    return;
  }

  if (!canReorder(next)) {
    useCardsStore.setState({ isReorderMode: false });
  }
};
