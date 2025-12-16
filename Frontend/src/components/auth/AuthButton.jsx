import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const AuthButton = ({ 
  children, 
  loading = false, 
  variant = 'primary', 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const { isDark } = useTheme()

  const variants = {
    primary: `
      bg-linear-to-r from-indigo-600 to-violet-600 
      text-white font-semibold
      hover:from-indigo-700 hover:to-violet-700
      focus:ring-4 focus:ring-indigo-500/50
      shadow-lg shadow-indigo-500/25
      disabled:from-gray-400 disabled:to-gray-500
    `,
    secondary: isDark 
      ? 'bg-gray-800 text-white border-2 border-gray-700 hover:bg-gray-700 focus:ring-4 focus:ring-gray-700/50'
      : 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200/50',
    outline: isDark
      ? 'border-2 border-gray-700 text-gray-200 hover:bg-gray-800 focus:ring-4 focus:ring-gray-700/50'
      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200/50'
  }

  return (
    <button
      className={`
        relative w-full px-6 py-3 rounded-lg
        transition-all duration-200
        focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}

export default AuthButton
