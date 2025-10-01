import React, { useEffect } from 'react'
import axios from 'axios'

const LoginSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const incomingToken = params.get('token')
    if (incomingToken) {
      localStorage.setItem('token', incomingToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${incomingToken}`
      window.location.replace('/dashboard')
    } else {
      window.location.replace('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default LoginSuccess 