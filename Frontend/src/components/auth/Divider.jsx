import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const Divider = ({ text = 'or' }) => {
  const { isDark } = useTheme()

  return (
    <div className="relative my-6">
      <div className={`absolute inset-0 flex items-center`}>
        <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className={`px-4 ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
          {text}
        </span>
      </div>
    </div>
  )
}

export default Divider
