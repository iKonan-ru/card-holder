import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CARD_VIEW_PERSIST_STORE_NAME,
  DEFAULT_CARD_FILTERS,
  DEFAULT_COLLAPSED_GROUPS,
  DEFAULT_GROUP_BY,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_KEY,
} from '../constants';
import type { ICardViewActions, ICardViewState } from '../types';
import type { ICardFilters } from '../types/view';
import { resetReorderModeIfNeeded } from './apply-reorder-guard';

export const useCardViewStore: UseBoundStore<
  StoreApi<ICardViewState & ICardViewActions>
> = create(
  persist(
    (set, get) => ({
      sortKey: DEFAULT_SORT_KEY,
      sortDirection: DEFAULT_SORT_DIRECTION,
      groupBy: DEFAULT_GROUP_BY,
      filters: DEFAULT_CARD_FILTERS,
      collapsedGroups: DEFAULT_COLLAPSED_GROUPS,

      setSortKey: (sortKey) => {
        const { groupBy, filters } = get();

        resetReorderModeIfNeeded({ sortKey, groupBy, filters });
        set({ sortKey });
      },

      setSortDirection: (sortDirection) => {
        set({ sortDirection });
      },

      setGroupBy: (groupBy) => {
        const { sortKey, filters } = get();

        resetReorderModeIfNeeded({ sortKey, groupBy, filters });
        set({ groupBy });
      },

      toggleGroupCollapsed: (groupId: string) => {
        set((state) => {
          const isCollapsed = state.collapsedGroups.includes(groupId);
          const collapsedGroups = isCollapsed
            ? state.collapsedGroups.filter((id) => id !== groupId)
            : [...state.collapsedGroups, groupId];

          return { collapsedGroups };
        });
      },

      setFilters: (partialFilters: Partial<ICardFilters>) => {
        const { sortKey, groupBy, filters: currentFilters } = get();
        const filters: ICardFilters = { ...currentFilters, ...partialFilters };

        resetReorderModeIfNeeded({ sortKey, groupBy, filters });
        set({ filters });
      },

      clearFilters: () => {
        set({ filters: DEFAULT_CARD_FILTERS });
      },

      resetView: () => {
        set({
          sortKey: DEFAULT_SORT_KEY,
          sortDirection: DEFAULT_SORT_DIRECTION,
          groupBy: DEFAULT_GROUP_BY,
          filters: DEFAULT_CARD_FILTERS,
          collapsedGroups: DEFAULT_COLLAPSED_GROUPS,
        });
      },
    }),
    {
      name: CARD_VIEW_PERSIST_STORE_NAME,
      partialize: (state) => ({
        sortKey: state.sortKey,
        sortDirection: state.sortDirection,
        groupBy: state.groupBy,
        filters: state.filters,
        collapsedGroups: state.collapsedGroups,
      }),
    },
  ),
);
