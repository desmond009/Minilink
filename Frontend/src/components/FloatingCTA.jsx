import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const FloatingCTA = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    // Scroll to the form section
    const formSection = document.querySelector('form')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 1
      }}
    >
      <motion.button 
        onClick={handleClick}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center backdrop-blur-sm border border-white/20"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 10px 30px rgba(249, 115, 22, 0.3)",
            "0 15px 35px rgba(249, 115, 22, 0.4)",
            "0 10px 30px rgba(249, 115, 22, 0.3)"
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <motion.span
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.span>
        <span className="mx-2">Start now:</span>
        <motion.svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ x: [0, 3, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </motion.svg>
        <motion.svg 
          className="w-5 h-5 ml-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ x: [0, -3, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
        </motion.svg>
      </motion.button>
    </motion.div>
  )
}

export default FloatingCTA
