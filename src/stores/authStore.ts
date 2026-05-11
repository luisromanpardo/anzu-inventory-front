import { create } from 'zustand';
import { authApi, usersApi, setAccessToken } from '../api';
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
  loadFromStorage: () => Promise<void>;
  clearError: () => void;
}

// Initialize with localStorage values
const storedRefreshToken = localStorage.getItem('refreshToken');
const storedAccessToken = localStorage.getItem('accessToken');
const storedUserStr = localStorage.getItem('user');
const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!(storedUser && storedRefreshToken),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
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
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  loadFromStorage: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    try {
      // Llamar al backend para obtener nuevos tokens
      const data = await authApi.refresh(refreshToken);
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Obtener datos del usuario
      const userData = await usersApi.getMe();
      localStorage.setItem('user', JSON.stringify(userData));

      set({
        refreshToken: data.refreshToken,
        accessToken: data.accessToken,
        user: userData,
        isAuthenticated: true,
      });
    } catch {
      // Refresh falló → limpiar todo
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setAccessToken(null);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));