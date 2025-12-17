import axios from 'axios'
import { API_ENDPOINTS } from './api'

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    })
    return response.data
  },

  register: async (name, email, password) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password
    })
    return response.data
  },

  logout: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  getProfile: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  updateProfile: async (userData) => {
    const token = localStorage.getItem('token')
    const response = await axios.put(API_ENDPOINTS.AUTH.PROFILE, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  changePassword: async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token')
    const response = await axios.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  getGoogleAuthUrl: async () => {
    const response = await axios.get(API_ENDPOINTS.AUTH.GOOGLE_URL)
    return response.data
  },

  getGithubAuthUrl: async () => {
    const response = await axios.get(API_ENDPOINTS.AUTH.GITHUB_URL)
    return response.data
  },

  getAppleAuthUrl: async () => {
    const response = await axios.get(API_ENDPOINTS.AUTH.APPLE_URL)
    return response.data
  }
}

export default authService



