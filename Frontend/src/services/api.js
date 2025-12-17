// API Configuration
// Ensure VITE_API_URL includes /api, or append it if not present
const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_BASE_URL = envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl}/api`

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
    CREATE: `${API_BASE_URL}/urls`,
    LIST: `${API_BASE_URL}/urls`,
    GET: (id) => `${API_BASE_URL}/urls/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/urls/${id}`,
    DELETE: (id) => `${API_BASE_URL}/urls/${id}`,
    ANALYTICS: (id) => `${API_BASE_URL}/urls/${id}/analytics`,
    QRCODE: (id) => `${API_BASE_URL}/urls/${id}/qrcode`,
    DASHBOARD_STATS: `${API_BASE_URL}/urls/stats/dashboard`,
  }
}

export default API_BASE_URL
