import React from 'react'
import { useTheme } from '../context/ThemeContext'

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon = null,
  className = '',
}) => {
  const { isDark } = useTheme()

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const variants = {
    primary: isDark
      ? 'bg-indigo-900/30 text-indigo-300 border border-indigo-500/30'
      : 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    secondary: isDark
      ? 'bg-slate-700/50 text-slate-300 border border-slate-600'
      : 'bg-slate-200 text-slate-700 border border-slate-300',
    success: isDark
      ? 'bg-green-900/30 text-green-300 border border-green-500/30'
      : 'bg-green-100 text-green-700 border border-green-200',
    warning: isDark
      ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'
      : 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: isDark
      ? 'bg-red-900/30 text-red-300 border border-red-500/30'
      : 'bg-red-100 text-red-700 border border-red-200',
  }

  return (
    <div
      className={`
        inline-flex items-center space-x-2
        rounded-full font-semibold
        transition-colors duration-300
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />}
      <span>{children}</span>
    </div>
  )
}

export default Badge
