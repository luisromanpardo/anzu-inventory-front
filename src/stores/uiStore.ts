import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  // Loading states
  isGlobalLoading: boolean;
  loadingMessage: string | null;

  // Toasts
  toasts: Toast[];

  // Modals
  isAddCardModalOpen: boolean;
  isEditCardModalOpen: boolean;
  editingInventoryItem: string | null;

  // Search
  searchQuery: string;

  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openAddCardModal: () => void;
  closeAddCardModal: () => void;
  openEditCardModal: (itemId: string) => void;
  closeEditCardModal: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isGlobalLoading: false,
  loadingMessage: null,
  toasts: [],
  isAddCardModalOpen: false,
  isEditCardModalOpen: false,
  editingInventoryItem: null,
  searchQuery: '',

  setGlobalLoading: (loading: boolean, message?: string) => {
    set({ isGlobalLoading: loading, loadingMessage: message || null });
  },

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove after duration (default 5 seconds)
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 5000);
  },

  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  openAddCardModal: () => {
    set({ isAddCardModalOpen: true });
  },

  closeAddCardModal: () => {
    set({ isAddCardModalOpen: false });
  },

  openEditCardModal: (itemId: string) => {
    set({ isEditCardModalOpen: true, editingInventoryItem: itemId });
  },

  closeEditCardModal: () => {
    set({ isEditCardModalOpen: false, editingInventoryItem: null });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));