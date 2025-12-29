import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: { email: string; name: string; password: string; password_confirmation: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.delete('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// Workouts API
export const workoutsApi = {
  list: (params?: { type?: string; month?: string; limit?: number }) =>
    api.get('/workouts', { params }),
  create: (data: { workout_type: string; duration: number; feeling: number; note?: string; date?: string }) =>
    api.post('/workouts', data),
  update: (id: number, data: Partial<{ workout_type: string; duration: number; feeling: number; note: string }>) =>
    api.patch(`/workouts/${id}`, data),
  delete: (id: number) => api.delete(`/workouts/${id}`),
}

// Stats API
export const statsApi = {
  streak: () => api.get('/stats/streak'),
  weekly: () => api.get('/stats/weekly'),
  monthly: (month?: string) => api.get('/stats/monthly', { params: { month } }),
  comparison: () => api.get('/stats/comparison'),
}
