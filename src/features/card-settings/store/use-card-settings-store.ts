import { create } from 'zustand';

interface ICardSettingsStore {
  isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}

export const useCardSettingsStore = create<ICardSettingsStore>((set) => ({
  isOpen: false,

  open: () => {
    set({ isOpen: true });
  },

  close: () => {
    set({ isOpen: false });
  },

  toggle: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
}));
