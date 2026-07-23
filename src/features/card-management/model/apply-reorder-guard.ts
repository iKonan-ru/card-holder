import { canReorder } from '../lib';
import type { ICardFilters } from '../types/view';
import { useCardsStore } from './cards-store';
import type { TGroupBy, TSortKey } from './view';

interface IReorderGuardParams {
  sortKey: TSortKey;
  groupBy: TGroupBy;
  filters: ICardFilters;
}

export const resetReorderModeIfNeeded = (next: IReorderGuardParams): void => {
  const { isReorderMode } = useCardsStore.getState();

  if (!isReorderMode) {
    return;
  }

  if (!canReorder(next)) {
    useCardsStore.setState({ isReorderMode: false });
  }
};
