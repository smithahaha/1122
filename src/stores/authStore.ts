import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  settings: {
    theme: 'dark' | 'light';
    language: string;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          const { user, token } = response.data;
          
          // 保存token到localStorage
          localStorage.setItem('auth-token', token);
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || '登录失败');
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register({ email, password, name });
          const { user, token } = response.data;
          
          // 保存token到localStorage
          localStorage.setItem('auth-token', token);
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || '注册失败');
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('auth-token');
          set({ user: null, isAuthenticated: false });
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        try {
          const response = await authApi.updateProfile(updates);
          const { user } = response.data;
          set({ user });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || '更新失败');
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          return;
        }

        try {
          const response = await authApi.me();
          const { user } = response.data;
          set({ user, isAuthenticated: true });
        } catch (error) {
          localStorage.removeItem('auth-token');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 