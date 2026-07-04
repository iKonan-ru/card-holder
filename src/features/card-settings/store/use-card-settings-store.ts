import { create } from 'zustand';

/**
 * Состояние панели настроек отображения списка карт
 */
interface ICardSettingsStore {
  /**
   * Открыта ли панель
   */
  isOpen: boolean;
  /**
   * Открывает панель
   */
  open(): void;
  /**
   * Закрывает панель
   */
  close(): void;
  /**
   * Переключает состояние панели
   */
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
