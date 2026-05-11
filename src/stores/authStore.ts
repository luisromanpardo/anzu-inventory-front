import { create } from 'zustand';
import { authApi, setAccessToken } from '../api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    terms_accepted: boolean;
  }) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      setAccessToken(data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    terms_accepted: boolean;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      setAccessToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authApi.logout().catch(() => {
      // Ignore logout API errors
    });
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  loadFromStorage: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken && get().accessToken) {
      // We have a refresh token, try to restore session
      // In a real app, you'd validate the token with the backend here
      set({ refreshToken });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));