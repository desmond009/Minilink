import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Mail, Lock, Github, Chrome, ArrowRight } from 'lucide-react'

// For OAuth, we'll use the API endpoints from config if available
const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_URL: '/api/auth/google',
    GITHUB_URL: '/api/auth/github'
  }
}

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast.success('Login successful!')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
    
    setLoading(false)
  }

  const startOAuth = async (provider) => {
    try {
      const endpoint = provider === 'google' ? API_ENDPOINTS.AUTH.GOOGLE_URL : API_ENDPOINTS.AUTH.GITHUB_URL
      const res = await fetch(endpoint, { credentials: 'include' })
      const data = await res.json()
      if (data?.success && data?.url) {
        window.location.href = data.url
      } else {
        toast.error(data?.message || `Failed to start ${provider} login`)
      }
    } catch (err) {
      toast.error(`Failed to start ${provider} login`)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Left Side - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 ${
        isDark ? 'bg-slate-950' : 'bg-white'
      }`}>
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link to="/" className="flex items-center group">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                MiniLink
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back
            </h1>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Sign in to your account to continue shortening URLs
            </p>
          </motion.div>

          {/* Social Auth Buttons */}
          <motion.div variants={itemVariants} className="space-y-3 mb-6">
            <button
              onClick={() => startOAuth('google')}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 border ${
                isDark
                  ? 'border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800/70'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-slate-950' : ''}`}
            >
              <Chrome size={20} />
              Continue with Google
            </button>

            <button
              onClick={() => startOAuth('github')}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 border ${
                isDark
                  ? 'border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800/70'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-slate-950' : ''}`}
            >
              <Github size={20} />
              Continue with GitHub
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative mb-6">
            <div className={`absolute inset-0 flex items-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></div>
            </div>
            <div className={`relative flex justify-center text-sm ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              <span className={`px-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Or continue with email
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Email address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-indigo-500 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Sign up Link */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Visual (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700`} />

        {/* Animated Blobs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full opacity-30 blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-400 rounded-full opacity-30 blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative w-full flex flex-col items-center justify-center px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-12 left-12 text-white text-6xl font-bold opacity-10"
          >
            ∞
          </motion.div>

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm text-white text-center"
          >
            <div className="text-5xl font-bold mb-3">1M+</div>
            <p className="text-lg font-semibold mb-2">Links Shortened</p>
            <p className="text-white/70 text-sm">Join thousands of users creating short, shareable links</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 mt-12 w-full max-w-md"
          >
            {[
              { number: '99.9%', label: 'Uptime' },
              { number: '<1s', label: 'Redirect' },
              { number: '∞', label: 'Free Links' }
            ].map((stat, idx) => (
              <div key={idx} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-white/70 text-xs font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
