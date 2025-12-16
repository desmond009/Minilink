import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

const AuthCard = ({ children, title, subtitle }) => {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        w-full max-w-md p-8 rounded-2xl shadow-2xl
        ${isDark 
          ? 'bg-gray-900/90 border border-gray-800' 
          : 'bg-white border border-gray-100'
        }
        backdrop-blur-xl
      `}
    >
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  )
}

export default AuthCard
