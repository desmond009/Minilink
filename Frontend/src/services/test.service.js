/**
 * API Integration Test Utilities
 * Use these functions to test backend connectivity
 */

import { authService } from './auth.service'
import { urlService } from './url.service'
import { apiClient } from '../api/config'

export const testBackendConnection = async () => {
  try {
    const response = await apiClient.get('/')
    console.log('✅ Backend connection successful:', response.data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message)
    return { success: false, error: error.message }
  }
}

export const testAuthEndpoints = async (email, password) => {
  console.log('Testing authentication endpoints...')
  
  try {
    // Test login
    const loginResult = await authService.login(email, password)
    console.log('✅ Login successful:', loginResult)
    
    // Test get profile
    const profileResult = await authService.getProfile()
    console.log('✅ Get profile successful:', profileResult)
    
    return { success: true }
  } catch (error) {
    console.error('❌ Auth test failed:', error.response?.data || error.message)
    return { success: false, error: error.response?.data || error.message }
  }
}

export const testUrlShortening = async (url) => {
  console.log('Testing URL shortening...')
  
  try {
    const result = await urlService.createShortUrl(url)
    console.log('✅ URL shortened successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('❌ URL shortening failed:', error.response?.data || error.message)
    return { success: false, error: error.response?.data || error.message }
  }
}

export const testOAuthUrls = async () => {
  console.log('Testing OAuth URL generation...')
  
  try {
    const googleUrl = await authService.getGoogleAuthUrl()
    console.log('✅ Google OAuth URL:', googleUrl)
    
    return { success: true, googleUrl }
  } catch (error) {
    console.error('❌ OAuth URL generation failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Export all tests as a suite
export const runAllTests = async () => {
  console.log('🧪 Running API Integration Tests...\n')
  
  const results = {
    connection: await testBackendConnection(),
    oauth: await testOAuthUrls()
  }
  
  console.log('\n📊 Test Results:', results)
  return results
}

export default {
  testBackendConnection,
  testAuthEndpoints,
  testUrlShortening,
  testOAuthUrls,
  runAllTests
}
