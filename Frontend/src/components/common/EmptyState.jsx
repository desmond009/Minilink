import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'

const EmptyState = ({ icon: Icon, title, description, action = null }) => {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-colors duration-300 ${
          isDark
            ? 'bg-slate-800 border-2 border-slate-700'
            : 'bg-slate-100 border-2 border-slate-200'
        }`}
      >
        {Icon ? (
          <Icon size={48} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
        ) : null}
      </motion.div>

      <h3 className={`text-2xl font-bold text-center mb-3 transition-colors duration-300 ${
        isDark ? 'text-slate-200' : 'text-slate-900'
      }`}>
        {title}
      </h3>

      <p className={`text-lg text-center max-w-md mb-8 transition-colors duration-300 ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {description}
      </p>

      {action && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.href ? (
            <Link
              to={action.href}
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg transition-all duration-300"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg transition-all duration-300"
            >
              {action.label}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState
