// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    GOOGLE_URL: `${API_BASE_URL}/oauth/google/url`,
    GITHUB_URL: `${API_BASE_URL}/oauth/github/url`,
    APPLE_URL: `${API_BASE_URL}/oauth/apple/url`
  },
  
  // URL endpoints
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
