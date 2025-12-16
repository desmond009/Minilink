import axios from 'axios'
import { API_ENDPOINTS } from './api'

export const urlService = {
  createShortUrl: async (originalUrl, customAlias) => {
    const response = await axios.post(API_ENDPOINTS.URL.CREATE, {
      originalUrl,
      customAlias: customAlias || undefined
    })
    return response.data
  },

  getUserUrls: async () => {
    const response = await axios.get(API_ENDPOINTS.URL.GET_USER_URLS)
    return response.data
  },

  deleteUrl: async (urlId) => {
    const response = await axios.delete(`${API_ENDPOINTS.URL.DELETE_URL}/${urlId}`)
    return response.data
  },

  updateUrl: async (urlId, data) => {
    const response = await axios.put(`${API_ENDPOINTS.URL.UPDATE_URL}/${urlId}`, data)
    return response.data
  }
}


