import { create } from 'zustand';

type ModalId = string;
type CloseHandler = () => void;

interface ModalItem {
  id: ModalId;
  onClose: CloseHandler;
}

interface ModalStackState {
  stack: ModalItem[];
}

interface ModalStackActions {
  push: (id: ModalId, onClose: CloseHandler) => void;
  remove: (id: ModalId) => void;
  closeTop: () => boolean;
  isTop: (id: ModalId) => boolean;
  getSize: () => number;
  clear: () => void;
}

export const useModalStack = create<ModalStackState & ModalStackActions>(
  (set, get) => ({
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
  })
);
