import axios from 'axios'
import { API_ENDPOINTS } from './api'
import { SHORT_BASE_URL } from '../utils/constants'

/**
 * Transform API response to include constructed shortUrl
 * Backend returns shortId, frontend needs full short URL
 */
const transformUrlData = (data) => {
  if (!data) return data
  
  // Single URL object
  if (data.shortId && !data.shortUrl) {
    return {
      ...data,
      shortUrl: `${SHORT_BASE_URL}/${data.shortId}`
    }
  }
  
  return data
}

/**
 * Transform array of URL objects
 */
const transformUrlArray = (urls) => {
  if (!Array.isArray(urls)) return urls
  return urls.map(transformUrlData)
}

export const urlService = {
  createShortUrl: async (originalUrl) => {
    const payload = { originalUrl }
    
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(API_ENDPOINTS.LINKS.CREATE, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Transform response to include shortUrl
      if (response.data && response.data.data) {
        response.data.data = transformUrlData(response.data.data)
      }
      
      return response.data
    } catch (error) {
      // Re-throw with better error message handling
      if (error.response) {
        // Server responded with error
        throw error
      } else if (error.request) {
        // Request made but no response
        throw new Error('Network error. Please check your connection and try again.')
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred')
      }
    }
  },

  getUserUrls: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(API_ENDPOINTS.LINKS.LIST, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Transform response to include shortUrl for each link
    if (response.data && response.data.data) {
      response.data.data = transformUrlArray(response.data.data)
    }
    
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
    
    // Transform response to include shortUrl for each link
    if (response.data && response.data.data) {
      response.data.data = transformUrlArray(response.data.data)
    }
    
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
    
    // Transform response to include shortUrl
    if (response.data && response.data.data) {
      response.data.data = transformUrlData(response.data.data)
    }
    
    return response.data
  }
}

export default urlService



