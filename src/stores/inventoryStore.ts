import { create } from 'zustand';
import { inventoryApi } from '../api';
import type { InventoryItem, AddInventoryItem, UpdateInventoryItem } from '../types';

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;

  // Actions
  fetchMyInventory: () => Promise<void>;
  addItem: (item: AddInventoryItem) => Promise<void>;
  updateItem: (id: string, data: UpdateInventoryItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  totalCount: 0,

  fetchMyInventory: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await inventoryApi.getMyInventory();
      set({ items: data, totalCount: data.length, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch inventory';
      set({ error: message, isLoading: false });
    }
  },

  addItem: async (item: AddInventoryItem) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await inventoryApi.addItem(item);
      set((state) => ({
        items: [...state.items, newItem],
        totalCount: state.totalCount + 1,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add item';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateItem: async (id: string, data: UpdateInventoryItem) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await inventoryApi.updateItem(id, data);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update item';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryApi.deleteItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        totalCount: state.totalCount - 1,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete item';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));