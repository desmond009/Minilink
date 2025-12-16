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
    GOOGLE_URL: `${API_BASE_URL}/oauth/google/url`,
    APPLE_URL: `${API_BASE_URL}/oauth/apple/url`
  },
  
  // URL endpoints
  URL: {
    CREATE: `${API_BASE_URL}/create`,
    GET_USER_URLS: `${API_BASE_URL}/urls/user`,
    DELETE_URL: `${API_BASE_URL}/urls`,
    UPDATE_URL: `${API_BASE_URL}/urls`
  }
}

export default API_BASE_URL
