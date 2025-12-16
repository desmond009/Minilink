import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiClient, API_ENDPOINTS } from '../api/config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Handle token from OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const incomingToken = params.get('token')
    if (window.location.pathname === '/login/success' && incomingToken) {
      localStorage.setItem('token', incomingToken)
      setToken(incomingToken)
      // cleanup URL then fetch profile below
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [])

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE)
          setUser(response.data.data)
        } catch (error) {
          console.error('Auth check failed:', error)
          logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      })

      const { token: newToken, data } = response.data
      setToken(newToken)
      setUser(data)
      localStorage.setItem('token', newToken)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password
      })

      const { token: newToken, data } = response.data
      setToken(newToken)
      setUser(data)
      localStorage.setItem('token', newToken)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
    }
  }

  const updateProfile = async (userData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, userData)
      setUser(response.data.data)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed'
      }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
