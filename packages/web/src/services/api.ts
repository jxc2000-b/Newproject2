import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Content types
export interface ContentItem {
  id: string;
  source: string;
  url: string;
  title: string;
  timestamp: string;
  type: 'article' | 'image' | 'video' | 'notification' | 'event';
  meta: Record<string, any>;
}

export interface ScoredContentItem {
  content: ContentItem;
  score: number;
  scoreBreakdown?: Record<string, number>;
}

export interface FeedResult {
  items: ScoredContentItem[];
  meta: {
    totalProcessed: number;
    totalFiltered: number;
    executionTimeMs: number;
  };
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  tags: string[];
  config: any;
}

export interface Source {
  id: string;
  name: string;
  type: string;
  config: any;
  enabled: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  url?: string;
  source?: string;
}

// Feed API
export const feedApi = {
  getFeed: async (algorithmId: string): Promise<FeedResult> => {
    const { data } = await api.get(`/feed/${algorithmId}`);
    return data;
  },

  getCustomFeed: async (yaml: string): Promise<FeedResult> => {
    const { data } = await api.post('/feed/custom', { yaml });
    return data;
  },

  getContent: async (limit = 100, offset = 0) => {
    const { data } = await api.get('/content', { params: { limit, offset } });
    return data.items as ContentItem[];
  },
};

// Algorithm API
export const algorithmApi = {
  getAll: async (): Promise<Algorithm[]> => {
    const { data } = await api.get('/algorithms');
    return data.algorithms;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/algorithms/${id}`);
    return data;
  },

  create: async (yaml: string): Promise<{ id: string; config: any }> => {
    const { data } = await api.post('/algorithms', { yaml });
    return data;
  },

  update: async (id: string, yaml: string): Promise<{ id: string; config: any }> => {
    const { data } = await api.put(`/algorithms/${id}`, { yaml });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/algorithms/${id}`);
  },
};

// Source API
export const sourceApi = {
  getAll: async (): Promise<Source[]> => {
    const { data } = await api.get('/sources');
    return data.sources;
  },

  getById: async (id: string): Promise<Source> => {
    const { data } = await api.get(`/sources/${id}`);
    return data;
  },

  create: async (id: string, name: string, type: string, config: any): Promise<Source> => {
    const { data } = await api.post('/sources', { id, name, type, config });
    return data;
  },

  update: async (id: string, name: string, config: any): Promise<Source> => {
    const { data } = await api.put(`/sources/${id}`, { name, config });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sources/${id}`);
  },

  fetch: async (id: string) => {
    const { data } = await api.post(`/sources/${id}/fetch`);
    return data;
  },

  fetchAll: async () => {
    const { data } = await api.post('/sources/fetch-all');
    return data;
  },
};

// Notification API
export const notificationApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data.notifications;
  },

  getUnread: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications/unread');
    return data.notifications;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/read-all');
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};

// Marketplace API
export const marketplaceApi = {
  getAll: async () => {
    const { data } = await api.get('/marketplace');
    return data.algorithms;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/marketplace/${id}`);
    return data;
  },

  install: async (id: string) => {
    const { data } = await api.post(`/marketplace/${id}/install`);
    return data;
  },
};
