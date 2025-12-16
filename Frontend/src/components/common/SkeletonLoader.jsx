import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const { isDark } = useTheme()

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg animate-pulse`}>
            <div className={`h-12 w-12 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-xl mb-4`}></div>
            <div className={`h-8 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
            <div className={`h-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/2`}></div>
          </div>
        )
      
      case 'table':
        return (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`h-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded w-full`}></div>
              </div>
            ))}
          </div>
        )
      
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className={`h-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded w-full`}></div>
            <div className={`h-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded w-5/6`}></div>
            <div className={`h-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded w-4/6`}></div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  )
}

export default SkeletonLoader
