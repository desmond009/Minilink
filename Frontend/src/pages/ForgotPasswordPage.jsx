import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { useTheme } from '../context/ThemeContext'
import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import Input from '../components/auth/Input'
import AuthButton from '../components/auth/AuthButton'
import { motion } from 'framer-motion'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { isDark } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Password reset link sent to your email!')
    }, 1500)
  }

  return (
    <AuthLayout>
      <AuthCard
        title={submitted ? 'Check your email' : 'Reset password'}
        subtitle={submitted 
          ? `We've sent a password reset link to ${email}`
          : 'Enter your email to receive a password reset link'
        }
      >
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              autoComplete="email"
              disabled={loading}
            />

            <AuthButton type="submit" loading={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </AuthButton>

            <Link
              to="/login"
              className={`flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className={`mx-auto w-16 h-16 rounded-full ${
              isDark ? 'bg-green-500/20' : 'bg-green-100'
            } flex items-center justify-center`}>
              <Mail className={isDark ? 'text-green-400' : 'text-green-600'} size={32} />
            </div>

            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                try again
              </button>
            </p>

            <Link to="/login">
              <AuthButton variant="outline">
                Return to login
              </AuthButton>
            </Link>
          </motion.div>
        )}
      </AuthCard>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
