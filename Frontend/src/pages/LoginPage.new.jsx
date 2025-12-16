import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Mail, Lock, Eye, EyeOff, Chrome, Github, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import Input from '../components/auth/Input'
import AuthButton from '../components/auth/AuthButton'
import OAuthButton from '../components/auth/OAuthButton'
import Divider from '../components/auth/Divider'
import { motion } from 'framer-motion'
import { authService } from '../services/auth.service'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        toast.success('Welcome back! 🎉')
        navigate('/dashboard')
      } else {
        toast.error(result.message || 'Invalid credentials')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startOAuth = async (provider) => {
    try {
      let data
      if (provider === 'google') {
        data = await authService.getGoogleAuthUrl()
      } else if (provider === 'github') {
        toast.info('GitHub login will be available soon')
        return
      }
      
      if (data?.success && data?.url) {
        window.location.href = data.url
      } else {
        toast.error(data?.message || `Failed to start ${provider} login`)
      }
    } catch (err) {
      console.error(`OAuth error for ${provider}:`, err)
      toast.error(`Unable to connect with ${provider}. Please try again.`)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your account to continue"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <Input
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email}
            autoComplete="email"
            disabled={loading}
          />

          {/* Password Input */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            error={errors.password}
            autoComplete="current-password"
            disabled={loading}
          />

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <Link 
              to="/forgot-password"
              className={`text-sm font-medium transition-colors ${
                isDark 
                  ? 'text-indigo-400 hover:text-indigo-300' 
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <AuthButton type="submit" loading={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </AuthButton>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`flex items-center justify-center gap-2 text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Secure authentication with 256-bit encryption</span>
          </motion.div>
        </form>

        {/* Divider */}
        <Divider text="or continue with" />

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <OAuthButton
            provider="google"
            icon={Chrome}
            onClick={() => startOAuth('google')}
            disabled={loading}
          />
          <OAuthButton
            provider="github"
            icon={Github}
            onClick={() => startOAuth('github')}
            disabled={loading}
          />
        </div>

        {/* Sign Up Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 text-center text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className={`font-semibold transition-colors ${
              isDark 
                ? 'text-indigo-400 hover:text-indigo-300' 
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Sign up
          </Link>
        </motion.p>
      </AuthCard>
    </AuthLayout>
  )
}

export default LoginPage
