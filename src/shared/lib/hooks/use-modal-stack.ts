import { create, type StoreApi, type UseBoundStore } from 'zustand';
import type { Procedure } from '@shared/types';

type TModalId = string;
type TCloseHandler = Procedure;

interface IModalItem {
  id: TModalId;
  onClose: TCloseHandler;
}

interface IModalStackState {
  stack: IModalItem[];
}

interface IModalStackActions {
  push: (id: TModalId, onClose: TCloseHandler) => void;
  remove: (id: TModalId) => void;
  closeTop: () => boolean;
  isTop: (id: TModalId) => boolean;
  getSize: () => number;
  clear: Procedure;
}

export const useModalStack: UseBoundStore<
  StoreApi<IModalStackState & IModalStackActions>
> = create((set, get) => ({
  stack: [],

  push: (id, onClose) => {
    set((state) => ({
      stack: [...state.stack, { id, onClose }],
    }));
  },

  remove: (id) => {
    set((state) => ({
      stack: state.stack.filter((item) => item.id !== id),
    }));
  },

  closeTop: () => {
    const { stack } = get();

    if (stack.length === 0) {
      return false;
    }

    const topModal = stack[stack.length - 1];
    topModal.onClose();

    return true;
  },

  isTop: (id) => {
    const { stack } = get();

    if (stack.length === 0) {
      return false;
    }

    return stack[stack.length - 1].id === id;
  },

  getSize: () => {
    return get().stack.length;
  },

  clear: () => {
    set({ stack: [] });
  },
}));
