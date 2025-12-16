// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    GOOGLE_URL: `${API_BASE_URL}/auth/google`,
    GITHUB_URL: `${API_BASE_URL}/auth/github`,
  },
  LINKS: {
    CREATE: `${API_BASE_URL}/create`,
    LIST: `${API_BASE_URL}/create/links`,
    GET: (id) => `${API_BASE_URL}/links/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/links/${id}`,
    DELETE: (id) => `${API_BASE_URL}/links/${id}`,
    ANALYTICS: (id) => `${API_BASE_URL}/links/${id}/analytics`,
  },
  TEMP_LINKS: {
    CREATE: `${API_BASE_URL}/temp`,
    GET: (id) => `${API_BASE_URL}/temp/${id}`,
  },
}

// Axios instance with default config
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
