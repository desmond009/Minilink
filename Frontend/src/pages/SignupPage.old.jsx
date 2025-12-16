import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Mail, Lock, Github, Chrome, User as UserIcon, ArrowRight, Check } from 'lucide-react'
import { authService } from '../services/auth.service'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
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
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const result = await register(formData.name, formData.email, formData.password)
    
    if (result.success) {
      toast.success('Registration successful!')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
    
    setLoading(false)
  }

  const startOAuth = async (provider) => {
    try {
      let data
      if (provider === 'google') {
        data = await authService.getGoogleAuthUrl()
      } else if (provider === 'github') {
        toast.info('GitHub signup will be available soon')
        return
      }
      
      if (data?.success && data?.url) {
        window.location.href = data.url
      } else {
        toast.error(data?.message || `Failed to start ${provider} signup`)
      }
    } catch (err) {
      console.error(`OAuth error for ${provider}:`, err)
      toast.error(`Unable to connect with ${provider}. Please try again.`)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const features = [
    'Unlimited short links',
    'QR code generation',
    'Click analytics & insights',
    'Custom domain support',
    'Password protection'
  ]

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Left Side - Visual (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700`} />

        {/* Animated Blobs */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-30 blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full opacity-30 blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative w-full flex flex-col items-center justify-center px-12 py-8">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Start Shortening Today
            </h2>
            <p className="text-white/80 text-lg font-medium">
              Create professional short links in seconds
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div
            className="space-y-4 mb-12 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                }}
                className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-4 py-3"
              >
                <div className="flex-shrink-0">
                  <Check className="text-emerald-400" size={20} />
                </div>
                <span className="text-white font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 max-w-sm text-white"
          >
            <p className="text-sm font-medium mb-4 italic">"MiniLink has transformed how we share links. Simple, fast, and reliable."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
              <div>
                <p className="font-semibold text-sm">Sarah Mitchell</p>
                <p className="text-white/60 text-xs">Marketing Director</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
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
              Create account
            </h1>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Join thousands sharing smarter links
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
                Or register with email
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Full name
              </label>
              <div className="relative">
                <UserIcon className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  } focus:outline-none`}
                />
              </div>
            </div>

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
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Field */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Confirm password
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-6 ${
                loading
                  ? 'bg-indigo-500 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Terms & Sign in Link */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mb-4`}>
              By signing up, you agree to our{' '}
              <Link to="/terms" className="underline font-semibold hover:text-indigo-600 transition-colors">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline font-semibold hover:text-indigo-600 transition-colors">
                Privacy Policy
              </Link>
            </p>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignupPage
