import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const OAuthButton = ({ provider, icon: Icon, onClick, disabled }) => {
  const { isDark } = useTheme()

  const providerStyles = {
    google: {
      light: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
      dark: 'bg-gray-800 border-2 border-gray-700 text-gray-200 hover:bg-gray-700',
      icon: 'text-red-500'
    },
    github: {
      light: 'bg-gray-900 border-2 border-gray-900 text-white hover:bg-gray-800',
      dark: 'bg-gray-700 border-2 border-gray-600 text-white hover:bg-gray-600',
      icon: 'text-white'
    }
  }

  const style = providerStyles[provider] || providerStyles.google
  const bgStyle = isDark ? style.dark : style.light

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-3 rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-gray-300/50
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3
        font-medium
        ${bgStyle}
      `}
    >
      {Icon && <Icon size={20} className={style.icon} />}
      <span>Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
    </button>
  )
}

export default OAuthButton
