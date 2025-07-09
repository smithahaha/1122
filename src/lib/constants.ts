export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    PROFILE: '/api/auth/profile',
    LOGOUT: '/api/auth/logout',
  },
  CHAT: {
    MODELS: '/api/chat/models',
    CONVERSATIONS: '/api/chat/conversations',
    MESSAGES: (id: string) => `/api/chat/conversations/${id}/messages`,
    STREAM: (id: string) => `/api/chat/conversations/${id}/stream`,
  },
  TRANSLATE: {
    TRANSLATE: '/api/translate',
    BATCH: '/api/translate/batch',
    HISTORY: '/api/translate/history',
    LANGUAGES: '/api/translate/languages',
    DETECT: '/api/translate/detect',
  },
}; 