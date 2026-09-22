import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIResponse {
  message: string;
  commands?: any[];
  reasoning?: string;
}

export const aiService = {
  sendMessage: async (messages: AIMessage[], sessionId?: string): Promise<AIResponse> => {
    const response = await api.post('/ai/chat', { messages, sessionId });
    return response.data;
  },

  analyzeError: async (error: string, sessionId: string): Promise<{ analysis: string }> => {
    const response = await api.post('/ai/analyze-error', { error, sessionId });
    return response.data;
  },

  getSuggestions: async (sessionId: string): Promise<{ suggestions: string[] }> => {
    const response = await api.post('/ai/suggestions', { sessionId });
    return response.data;
  }
};

export interface AssetSearchResult {
  assets: any[];
  total?: number;
}

export const assetsService = {
  search: async (query: string, category?: string, limit?: number): Promise<AssetSearchResult> => {
    const response = await api.get('/assets/search', {
      params: { query, category, limit }
    });
    return response.data;
  },

  getDetails: async (assetId: number): Promise<any> => {
    const response = await api.get(`/assets/details/${assetId}`);
    return response.data;
  },

  getFeatured: async (category?: string, limit?: number): Promise<AssetSearchResult> => {
    const response = await api.get('/assets/featured', {
      params: { category, limit }
    });
    return response.data;
  },

  getCategories: async (): Promise<{ categories: any[] }> => {
    const response = await api.get('/assets/categories');
    return response.data;
  }
};

export const pluginService = {
  queueCommand: async (command: any): Promise<any> => {
    const response = await api.post('/plugin/command', command);
    return response.data;
  },

  verifySession: async (sessionId: string, secret: string): Promise<any> => {
    const response = await api.post('/plugin/verify', { sessionId, secret });
    return response.data;
  },

  getSessionStatus: async (sessionId: string): Promise<any> => {
    const response = await api.get(`/plugin/session/${sessionId}`);
    return response.data;
  }
};
