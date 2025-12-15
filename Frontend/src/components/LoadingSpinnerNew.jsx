import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const LoadingSpinnerNew = ({ size = 'md', fullScreen = false }) => {
  const { isDark } = useTheme()

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const spinner = (
    <motion.div
      className={`${sizeMap[size]} relative`}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        className={`w-full h-full ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className={`opacity-25 ${isDark ? 'stroke-slate-700' : 'stroke-slate-200'}`}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-900/80' : 'bg-white/80'
      } backdrop-blur-sm z-50`}>
        <div className="flex flex-col items-center space-y-4">
          {spinner}
          <p className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return <div className="flex items-center justify-center">{spinner}</div>
}

export default LoadingSpinnerNew
