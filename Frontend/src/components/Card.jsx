import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  variant = 'default',
  ...props 
}) => {
  const { isDark } = useTheme()

  const variants = {
    default: isDark
      ? 'bg-slate-800/50 border border-slate-700/50'
      : 'bg-white border border-slate-200',
    elevated: isDark
      ? 'bg-slate-800 border border-slate-700 shadow-xl'
      : 'bg-white border border-slate-200 shadow-lg',
    glass: isDark
      ? 'bg-slate-800/30 backdrop-blur-xl border border-slate-700/50'
      : 'bg-white/30 backdrop-blur-xl border border-slate-200/50',
    gradient: isDark
      ? 'bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border border-indigo-700/30'
      : 'bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200',
    success: isDark
      ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30'
      : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
  }

  const MotionDiv = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { scale: 1.02 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  } : {}

  return (
    <MotionDiv
      className={`rounded-2xl transition-all duration-300 ${variants[variant]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export default Card
