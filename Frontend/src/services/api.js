// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    GOOGLE_URL: `${API_BASE_URL}/auth/google`,
    GITHUB_URL: `${API_BASE_URL}/auth/github`,
    APPLE_URL: `${API_BASE_URL}/oauth/apple/url`
  },
  
  // URL endpoints
  URL: {
    CREATE: `${API_BASE_URL}/create`,
    GET_USER_URLS: `${API_BASE_URL}/urls/user`,
    DELETE_URL: `${API_BASE_URL}/urls`,
    UPDATE_URL: `${API_BASE_URL}/urls`
  },

  // Links endpoints (alternative naming)
  LINKS: {
    CREATE: `${API_BASE_URL}/create`,
    LIST: `${API_BASE_URL}/create/links`,
    GET: (id) => `${API_BASE_URL}/links/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/links/${id}`,
    DELETE: (id) => `${API_BASE_URL}/links/${id}`,
    ANALYTICS: (id) => `${API_BASE_URL}/links/${id}/analytics`,
  }
}

export default API_BASE_URL
