import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data);
    return Promise.reject(error);
  }
);

export const emailAPI = {
  loadMockInbox: () => api.post('/emails/load'),
  getAllEmails: (params) => api.get('/emails', { params }),
  getEmail: (id) => api.get(`/emails/${id}`),
  processEmail: (id) => api.post(`/emails/process/${id}`),
  processAllEmails: () => api.post('/emails/process-all'),
  toggleActionItem: (emailId, itemIndex) => api.put(`/emails/${emailId}/action-items/${itemIndex}/toggle`),
};

export const promptAPI = {
  getAllPrompts: () => api.get('/prompts'),
  createPrompt: (data) => api.post('/prompts', data),
  updatePrompt: (id, data) => api.put(`/prompts/${id}`, data),
  deletePrompt: (id) => api.delete(`/prompts/${id}`),
  initializePrompts: () => api.post('/prompts/initialize'),
};

export const agentAPI = {
  query: (data) => api.post('/agent/query', data),
  chat: (data) => api.post('/agent/chat', data),
  generateReply: (data) => api.post('/agent/generate-reply', data),
  summarize: (data) => api.post('/agent/summarize', data),
  urgentSummary: () => api.post('/agent/urgent-summary'),
};

export const draftAPI = {
  getAllDrafts: () => api.get('/drafts'),
  getDraft: (id) => api.get(`/drafts/${id}`),
  createDraft: (data) => api.post('/drafts', data),
  updateDraft: (id, data) => api.put(`/drafts/${id}`, data),
  deleteDraft: (id) => api.delete(`/drafts/${id}`),
};

export default api;
