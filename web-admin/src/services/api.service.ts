import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

export const propertyService = {
  getAll: (params?: any) => api.get('/properties/my', { params }),
  create: (data: any) => api.post('/properties', data),
  update: (id: number, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: number) => api.delete(`/properties/${id}`),
  getMyRooms: (params?: any) => api.get('/properties/my-rooms', { params }),
  getRooms: (propertyId: number) => api.get(`/properties/${propertyId}/rooms`),
  createRoom: (data: any) => api.post('/properties/rooms', data),
  updateRoom: (id: number, data: any) => api.put(`/properties/rooms/${id}`, data),
  deleteRoom: (id: number) => api.delete(`/properties/rooms/${id}`),
  approveProperty: (id: number) => api.patch(`/properties/${id}/approve`),
  approveRoom: (id: number) => api.patch(`/properties/rooms/${id}/approve`),
};

export const postService = {
  create: (data: any) => api.post('/posts', data),
  update: (id: number, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: number) => api.delete(`/posts/${id}`),
  getMyPosts: (params?: any) => api.get('/posts/my', { params }),
  approve: (id: number) => api.patch(`/posts/${id}/approve`),
};

export const uploadService = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const billingService = {
  getInvoices: (params?: any) => api.get('/billing/my-invoices', { params }),
  getInvoiceById: (id: string) => api.get(`/billing/invoices/${id}`),
  updateInvoice: (id: string, data: any) => api.patch(`/billing/invoices/${id}`, data),
  deleteInvoice: (id: string) => api.delete(`/billing/invoices/${id}`),
  createInvoice: (data: any) => api.post('/billing/invoices', data),
  getContracts: () => api.get('/billing/my-contracts'),
  createContract: (data: any) => api.post('/billing/contracts', data),
};

export const statsService = {
  getDashboard: (timeframe?: number) => api.get('/stats/dashboard', { params: { timeframe } }),
};

export const reportService = {
  getAll: (params?: any) => api.get('/reports', { params }),
  updateStatus: (id: number, status: string) => api.patch(`/reports/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/reports/${id}`),
};

export const chatService = {
  getConversations: () => api.get('/chat'),
  getMessages: (conversationId: number) => api.get(`/chat/${conversationId}`),
  sendMessage: (data: any) => api.post('/chat/send', data),
};

export { api };
export default api;
