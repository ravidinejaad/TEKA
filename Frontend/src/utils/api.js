import axios from 'axios';
import { STORAGE_KEYS } from './constants';
import { storage } from './storage';

// Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: attach token
API.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle data unwrapping & 401
API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
      
      // If we have a refresh token, try refreshing once
      if (refreshToken && !originalRequest.url?.includes('/auth/refresh-token')) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
            { refreshToken }
          );
          if (res.data?.success && res.data.data?.token) {
            storage.set(STORAGE_KEYS.TOKEN, res.data.data.token);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.token}`;
            return API(originalRequest);
          }
        } catch (refreshErr) {
          // Token refresh failed, clear session
          storage.remove(STORAGE_KEYS.TOKEN);
          storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
          storage.remove(STORAGE_KEYS.USER);
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        }
      } else {
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message || 'Terjadi kesalahan sistem',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default API;

// ============================================
// API ENDPOINTS HELPER FUNCTIONS
// ============================================

// Authentication
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (nama, email, password) => API.post('/auth/register', { nama, email, password }),
  logout: () => API.post('/auth/logout'),
  refreshToken: (refreshToken) => API.post('/auth/refresh-token', { refreshToken }),
};

// Users
export const userAPI = {
  getProfile: () => API.get('/users/me'),
  getStats: () => API.get('/users/me/stats'),
  updateProfile: (data) => API.put('/users/me', data),
  changePassword: (data) => API.put('/users/me/password', data),
  getHistory: (params) => API.get('/results/user/history', { params }),
  uploadAvatar: (formData) =>
    API.post('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Quizzes
export const quizAPI = {
  getAll: (params) => API.get('/quizzes', { params }),
  getByClass: (classId, params) => API.get(`/quizzes/classes/${classId}`, { params }),
  getById: (id) => API.get(`/quizzes/${id}`),
  getQuestions: (quizId) => API.get(`/quizzes/${quizId}/questions`),
  create: (data) => API.post('/quizzes', data),
  update: (id, data) => API.put(`/quizzes/${id}`, data),
  publish: (id) => API.post(`/quizzes/${id}/publish`),
  close: (id) => API.post(`/quizzes/${id}/close`),
  startAttempt: (id_kuis) => API.post('/quiz-attempts', { id_kuis }),
  getAttempt: (id) => API.get(`/quiz-attempts/${id}`),
  saveAnswer: (attemptId, data) => API.post(`/quiz-attempts/${attemptId}/answers`, data),
  submitAttempt: (attemptId) => API.post(`/quiz-attempts/${attemptId}/submit`),
  getAttemptResults: (attemptId) => API.get(`/quiz-attempts/${attemptId}/results`),
  getQuizHistory: (quizId) => API.get(`/quiz-attempts/quiz/${quizId}/history`),
};

// Quiz Attempts
export const quizAttemptAPI = {
  start: (id_kuis) => API.post('/quiz-attempts', { id_kuis }),
  getById: (attemptId) => API.get(`/quiz-attempts/${attemptId}`),
  submitAnswers: (attemptId, jawaban) => API.post(`/quiz-attempts/${attemptId}/answers`, { jawaban }),
  complete: (attemptId) => API.post(`/quiz-attempts/${attemptId}/complete`),
  getResult: (attemptId) => API.get(`/quiz-attempts/${attemptId}/result`),
  getHistory: (params) => API.get('/quiz-attempts/history', { params }),
};

// Categories
export const categoryAPI = {
  getAll: (params) => API.get('/categories', { params }),
  getById: (id) => API.get(`/categories/${id}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// Classes
export const classAPI = {
  getAll: (params) => API.get('/classes', { params }),
  getById: (id) => API.get(`/classes/${id}`),
  create: (data) => API.post('/classes', data),
  joinClass: (kode_kelas) => API.post('/classes/join', { kode_kelas }),
  getMembers: (id, params) => API.get(`/classes/${id}/members`, { params }),
};

// Results & Leaderboards
export const resultAPI = {
  getQuizResults: (quizId, params) => API.get(`/results/quizzes/${quizId}`, { params }),
  getQuizAnalytics: (quizId) => API.get(`/results/quizzes/${quizId}/analytics`),
  getLeaderboard: (classId, params) => API.get(`/results/leaderboard/classes/${classId}`, { params }),
  getUserHistory: (params) => API.get('/results/user/history', { params }),
  getUserStatistics: () => API.get('/results/user/statistics'),
};

// Notifications
export const notificationAPI = {
  getAll: (params) => API.get('/notifications', { params }),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  delete: (id) => API.delete(`/notifications/${id}`),
};

// Admin
export const adminAPI = {
  // Dashboard & Analytics
  getAnalytics: () => API.get('/admin/analytics'),
  getDashboard: () => API.get('/admin/dashboard'),
  getTeacherRankings: (params) => API.get('/admin/teachers/rankings', { params }),
  getStudentActivity: (params) => API.get('/admin/students/activity', { params }),
  getHealth: () => API.get('/admin/health'),
  
  // User Management
  getAllUsers: (params) => API.get('/admin/users', { params }),
  getUserById: (id) => API.get(`/admin/users/${id}`),
  createUser: (data) => API.post('/admin/users', data),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  updateUserStatus: (id, status_aktif) => API.put(`/admin/users/${id}/status`, { status_aktif }),
  updateUserRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  
  // Category Management
  getAllCategories: (params) => API.get('/admin/categories', { params }),
  getCategoryById: (id) => API.get(`/admin/categories/${id}`),
  createCategory: (data) => API.post('/admin/categories', data),
  updateCategory: (id, data) => API.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),
  
  // Quiz Management
  getAllQuizzes: (params) => API.get('/admin/quizzes', { params }),
  deleteQuiz: (id) => API.delete(`/admin/quizzes/${id}`),
  
  // Stats
  getStats: () => API.get('/admin/stats'),
  getRecentActivity: (params) => API.get('/admin/activity', { params }),
};

