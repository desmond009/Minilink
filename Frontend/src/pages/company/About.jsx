import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/')}
            className="mb-8 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
          >
            ← Back to Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About MiniLink</h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <p className="text-gray-600">
              MiniLink is a powerful URL shortening and QR code generation platform designed to help 
              businesses and individuals create memorable, trackable links.
            </p>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To simplify link management and provide powerful analytics that help our users 
                understand their audience and optimize their digital marketing efforts.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
              <ul className="text-gray-700 space-y-2">
                <li>• URL shortening with custom aliases</li>
                <li>• QR code generation and management</li>
                <li>• Detailed analytics and click tracking</li>
                <li>• Branded links and custom domains</li>
                <li>• API access for developers</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
