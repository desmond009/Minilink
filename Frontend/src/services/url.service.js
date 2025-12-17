import axios from 'axios'
import { API_ENDPOINTS } from './api'

export const urlService = {
  createShortUrl: async (originalUrl, customAlias = null) => {
    const payload = { originalUrl }
    if (customAlias) {
      payload.customAlias = customAlias
    }
    
    const token = localStorage.getItem('token')
    const response = await axios.post(API_ENDPOINTS.LINKS.CREATE, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  getUserUrls: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(API_ENDPOINTS.LINKS.LIST, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  // Alias for backward compatibility
  getUserLinks: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(API_ENDPOINTS.LINKS.LIST, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  deleteUrl: async (id) => {
    const token = localStorage.getItem('token')
    const response = await axios.delete(API_ENDPOINTS.LINKS.DELETE(id), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  },

  updateUrl: async (id, data) => {
    const token = localStorage.getItem('token')
    const response = await axios.put(API_ENDPOINTS.LINKS.UPDATE(id), data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  }
}

export default urlService



