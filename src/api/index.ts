import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { toBackendCondition, fromBackendCondition } from '../lib/conditions';
import type { Condition } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage - using a simple approach since we don't have accessToken yet
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request interceptor - add JWT to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh tokens
      if (accessToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          // Store new tokens
          accessToken = newAccessToken;
          localStorage.setItem('refreshToken', newRefreshToken);
          setAccessToken(newAccessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear everything and logout
          accessToken = null;
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    terms_accepted: boolean;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data;
  },
};

// Cards API
export const cardsApi = {
  search: async (params: {
    q?: string;
    archetype?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/cards/search', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  getOwners: async (id: string) => {
    const response = await api.get(`/home/cards/${id}/owners`);
    return response.data;
  },
};

// Home API
export const homeApi = {
  getTopCards: async () => {
    const response = await api.get('/home');
    return response.data;
  },
};

// Inventory API
export const inventoryApi = {
  getMyInventory: async () => {
    const response = await api.get('/inventory/me');
    // Convertir condiciones del backend al formato del frontend
    return response.data.map((item: { condicion: string; card_id: number; [key: string]: unknown }) => ({
      ...item,
      card_id: String(item.card_id), // Guardar como string para consistencia en frontend
      condicion: fromBackendCondition(item.condicion),
    }));
  },

  addItem: async (data: {
    card_id: number;
    cantidad: number;
    condicion: Condition;
    idioma: string;
    edicion?: string;
    notas?: string;
  }) => {
    const response = await api.post('/inventory', {
      card_id: data.card_id,
      cantidad: data.cantidad,
      condicion: toBackendCondition(data.condicion),
      idioma: data.idioma,
      edicion: data.edicion || '',
      notas: data.notas || '',
    });
    return response.data;
  },

  updateItem: async (
    id: string,
    data: {
      cantidad?: number;
      condicion?: Condition;
      idioma?: string;
      edicion?: string;
      notas?: string;
    }
  ) => {
    const updateData: Record<string, unknown> = { ...data };
    if (updateData.condicion !== undefined) {
      updateData.condicion = toBackendCondition(updateData.condicion as Condition);
    }
    const response = await api.patch(`/inventory/${id}`, updateData);
    return response.data;
  },

  deleteItem: async (id: string) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateMe: async (data: {
    username?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
    discord?: string;
    konami_id?: string;
    is_public?: boolean;
  }) => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  getPublicProfile: async (username: string) => {
    const response = await api.get(`/u/${username}`);
    return response.data;
  },

  getUserProfile: async (username: string) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  follow: async (userId: string) => {
    const response = await api.post(`/social/follow/${userId}`);
    return response.data;
  },

  unfollow: async (userId: string) => {
    const response = await api.delete(`/social/unfollow/${userId}`);
    return response.data;
  },

  getFollowers: async (userId: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/social/followers/${userId}`, { params });
    return response.data;
  },

  getFollowing: async (userId: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/social/following/${userId}`, { params });
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getSyncStatus: async () => {
    const response = await api.get('/admin/sync/status');
    return response.data;
  },

  triggerSync: async () => {
    const response = await api.post('/admin/sync');
    return response.data;
  },
};