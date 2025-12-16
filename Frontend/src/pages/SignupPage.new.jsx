import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Mail, Lock, Eye, EyeOff, Chrome, Github, User, ShieldCheck, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import Input from '../components/auth/Input'
import AuthButton from '../components/auth/AuthButton'
import OAuthButton from '../components/auth/OAuthButton'
import Divider from '../components/auth/Divider'
import { motion } from 'framer-motion'

const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_URL: '/api/auth/google',
    GITHUB_URL: '/api/auth/github'
  }
}

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Contains a letter', met: /[a-zA-Z]/.test(formData.password) },
    { text: 'Contains a number', met: /[0-9]/.test(formData.password) }
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      const result = await register(formData.name, formData.email, formData.password)
      
      if (result.success) {
        toast.success('Account created successfully! 🎉')
        navigate('/dashboard')
      } else {
        toast.error(result.message || 'Registration failed')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startOAuth = async (provider) => {
    try {
      const endpoint = provider === 'google' 
        ? API_ENDPOINTS.AUTH.GOOGLE_URL 
        : API_ENDPOINTS.AUTH.GITHUB_URL
      
      const res = await fetch(endpoint, { credentials: 'include' })
      const data = await res.json()
      
      if (data?.success && data?.url) {
        window.location.href = data.url
      } else {
        toast.error(data?.message || `Failed to start ${provider} signup`)
      }
    } catch (err) {
      toast.error(`Unable to connect with ${provider}. Please try again.`)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle="Start shortening and tracking your links"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <Input
            label="Full name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            icon={User}
            error={errors.name}
            autoComplete="name"
            disabled={loading}
          />

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
          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password}
              autoComplete="new-password"
              disabled={loading}
            />
            
            {/* Password Requirements */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 space-y-1.5"
              >
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center text-xs transition-colors ${
                      req.met
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      req.met
                        ? 'bg-green-500'
                        : isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {req.met && <Check size={10} className="text-white" />}
                    </div>
                    {req.text}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Confirm Password Input */}
          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            icon={Lock}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            error={errors.confirmPassword}
            autoComplete="new-password"
            disabled={loading}
          />

          {/* Sign Up Button */}
          <AuthButton type="submit" loading={loading}>
            {loading ? 'Creating account...' : 'Create account'}
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
            <span>Your data is protected with enterprise-grade security</span>
          </motion.div>
        </form>

        {/* Divider */}
        <Divider text="or sign up with" />

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

        {/* Terms and Privacy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 text-xs text-center ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          By signing up, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-indigo-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-indigo-500">
            Privacy Policy
          </Link>
        </motion.p>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 text-center text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-semibold transition-colors ${
              isDark 
                ? 'text-indigo-400 hover:text-indigo-300' 
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Sign in
          </Link>
        </motion.p>
      </AuthCard>
    </AuthLayout>
  )
}

export default SignupPage
