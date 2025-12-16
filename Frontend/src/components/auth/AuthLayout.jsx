import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Link2, BarChart3, Shield } from 'lucide-react'

const AuthLayout = ({ children }) => {
  const { isDark } = useTheme()

  const features = [
    {
      icon: Link2,
      title: 'Smart URL Shortening',
      description: 'Create short, memorable links in seconds'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track clicks, locations, and more'
    },
    {
      icon: Sparkles,
      title: 'QR Code Generator',
      description: 'Generate QR codes for any link instantly'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security for your links'
    }
  ]

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Left Side - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden ${
        isDark ? 'bg-linear-to-br from-gray-900 via-indigo-900/20 to-violet-900/20' : 'bg-linear-to-br from-indigo-50 via-violet-50 to-purple-50'
      }`}>
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 flex items-center justify-center mr-3 shadow-lg">
                <Link2 className="text-white" size={24} />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent'
              }`}>
                MiniLink
              </span>
            </motion.div>
          </Link>

          {/* Features */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`text-4xl xl:text-5xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Shorten, Track,<br />and Analyze
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                The complete link management platform for modern teams
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-start space-x-4 p-4 rounded-xl ${
                    isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${
                    isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'
                  } flex items-center justify-center shrink-0`}>
                    <feature.icon className={isDark ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
          >
            © 2024 MiniLink. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 ${
        isDark ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
