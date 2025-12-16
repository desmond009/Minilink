import React, { forwardRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  rightIcon: RightIcon,
  onRightIconClick,
  helperText,
  className = '',
  ...props 
}, ref) => {
  const { isDark } = useTheme()

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            ${Icon ? 'pl-11' : ''}
            ${RightIcon ? 'pr-11' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : isDark 
                ? 'border-gray-700 bg-gray-800/50 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                : 'border-gray-200 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            }
            focus:outline-none
            placeholder:text-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            <RightIcon size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center">
          <span className="mr-1">•</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className={`mt-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
