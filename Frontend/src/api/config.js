// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_PREFIX = '/api'

console.log('🔧 API Config:', {
  API_BASE_URL,
  API_PREFIX,
  fullBaseURL: `${API_BASE_URL}${API_PREFIX}`
})

// Full URLs for standalone use (without apiClient)
export const API_URLS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}${API_PREFIX}/auth/login`,
    REGISTER: `${API_BASE_URL}${API_PREFIX}/auth/register`,
    LOGOUT: `${API_BASE_URL}${API_PREFIX}/auth/logout`,
    PROFILE: `${API_BASE_URL}${API_PREFIX}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}${API_PREFIX}/auth/change-password`,
    GOOGLE_URL: `${API_BASE_URL}${API_PREFIX}/oauth/google/url`,
    GITHUB_URL: `${API_BASE_URL}${API_PREFIX}/oauth/github/url`,
    APPLE_URL: `${API_BASE_URL}${API_PREFIX}/oauth/apple/url`,
  },
}

// Relative paths for use with apiClient (which has baseURL set)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    GOOGLE_URL: '/oauth/google/url',
    GITHUB_URL: '/oauth/github/url',
    APPLE_URL: '/oauth/apple/url',
  },
  LINKS: {
    CREATE: '/create',
    LIST: '/create/links',
    GET: (id) => `/links/${id}`,
    UPDATE: (id) => `/links/${id}`,
    DELETE: (id) => `/links/${id}`,
    ANALYTICS: (id) => `/links/${id}/analytics`,
  },
  TEMP_LINKS: {
    CREATE: '/temp',
    GET: (id) => `/temp/${id}`,
  },
}

// Axios instance with default config
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
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
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
