import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  me: () => api.get('/api/auth/me'),
  
  updateProfile: (data: { name?: string; avatar?: string; settings?: any }) =>
    api.put('/api/auth/profile', data),
  
  logout: () => api.post('/api/auth/logout'),
};

// 聊天相关API
export const chatApi = {
  getModels: () => api.get('/api/chat/models'),
  
  getConversations: (params?: { limit?: number; offset?: number }) =>
    api.get('/api/chat/conversations', { params }),
  
  getConversation: (id: string) =>
    api.get(`/api/chat/conversations/${id}`),
  
  createConversation: (data: { title?: string; model: string }) =>
    api.post('/api/chat/conversations', data),
  
  updateConversation: (id: string, data: { title: string }) =>
    api.put(`/api/chat/conversations/${id}`, data),
  
  deleteConversation: (id: string) =>
    api.delete(`/api/chat/conversations/${id}`),
  
  sendMessage: (conversationId: string, data: { content: string; role: 'user' | 'assistant' }) =>
    api.post(`/api/chat/conversations/${conversationId}/messages`, data),
  
  streamMessage: (conversationId: string, message: string, model: string) => {
    const token = localStorage.getItem('auth-token');
    return new EventSource(
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/stream?token=${token}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },
};

// 翻译相关API
export const translateApi = {
  translate: (data: { text: string; from: string; to: string; detectLang?: boolean }) =>
    api.post('/api/translate', data),
  
  translateBatch: (data: { texts: string[]; from: string; to: string }) =>
    api.post('/api/translate/batch', data),
  
  getHistory: (params?: { limit?: number; offset?: number }) =>
    api.get('/api/translate/history', { params }),
  
  deleteHistory: (id: string) =>
    api.delete(`/api/translate/history/${id}`),
  
  getLanguages: () => api.get('/api/translate/languages'),
  
  detectLanguage: (data: { text: string }) =>
    api.post('/api/translate/detect', data),
};

export default api; 