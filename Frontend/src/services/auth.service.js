import { apiClient, API_ENDPOINTS } from '../api/config'

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    })
    return response.data
  },

  register: async (name, email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password
    })
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    return response.data
  },

  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE)
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, userData)
    return response.data
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    })
    return response.data
  },

  getGoogleAuthUrl: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.GOOGLE_URL)
    return response.data
  },

  getGithubAuthUrl: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.GITHUB_URL)
    return response.data
  },

  getAppleAuthUrl: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.APPLE_URL)
    return response.data
  }
}

export default authService


