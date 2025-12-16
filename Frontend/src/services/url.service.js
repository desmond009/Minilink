import { apiClient, API_ENDPOINTS } from '../api/config'

export const urlService = {
  createShortUrl: async (originalUrl, customAlias = null) => {
    const payload = { originalUrl }
    if (customAlias) {
      payload.customAlias = customAlias
    }
    
    const response = await apiClient.post(API_ENDPOINTS.LINKS.CREATE, payload)
    return response.data
  },

  getUserLinks: async () => {
    const response = await apiClient.get(API_ENDPOINTS.LINKS.LIST)
    return response.data
  },

  getUrlById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.LINKS.GET(id))
    return response.data
  },

  updateUrl: async (id, data) => {
    const response = await apiClient.put(API_ENDPOINTS.LINKS.UPDATE(id), data)
    return response.data
  },

  deleteUrl: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.LINKS.DELETE(id))
    return response.data
  },

  getAnalytics: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.LINKS.ANALYTICS(id))
    return response.data
  }
}

export default urlService


