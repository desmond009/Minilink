import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTempLinks } from '../context/TempLinksContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import QRCodeGenerator from './QRCodeGenerator'
import QRCodeScanner from './QRCodeScanner'

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('shortlink')
  const [showQRCode, setShowQRCode] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  
  const { isAuthenticated, user } = useAuth()
  const { 
    tempLinks, 
    addTempLink, 
    canCreateTempLink, 
    getRemainingLinks, 
    MAX_TEMP_LINKS 
  } = useTempLinks()
  const navigate = useNavigate()

  // Generate a simple short ID for temp links
  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Handle URL shortening
  const handleShortUrl = async (e) => {
    e.preventDefault()
    
    // Check if user can create temp links
    if (!isAuthenticated && !canCreateTempLink()) {
      toast.info(`You can create up to ${MAX_TEMP_LINKS} links without login. Please login to create more links.`)
      navigate('/login')
      return
    }
    
    setIsLoading(true)

    try {
      if (isAuthenticated) {
        // Create permanent link with authentication
        const { data } = await axios.post(import.meta.env.VITE_API_URL + "/create", { 
          originalUrl: longUrl 
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        setShortUrl(data.data.shortUrl)
        toast.success('URL shortened successfully!')
      } else {
        // Create temporary link
        const shortId = generateShortId()
        const tempShortUrl = (import.meta.env.VITE_SHORT_BASE_URL || 'https://mini.lk') + `/${shortId}`
        
        // Add to temp links
        addTempLink(longUrl, tempShortUrl, shortId)
        setShortUrl(tempShortUrl)
        toast.success('URL shortened successfully! (Temporary - login to save permanently)')
      }
      
      // If QR Code tab is active, show QR code modal
      if (activeTab === 'qrcode') {
        setShowQRCode(true)
      }
    } catch (error) {
      console.error('Error creating short URL:', error)
      toast.error(error.response?.data?.message || 'Failed to shorten URL. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Copy short URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      toast.success('URL copied to clipboard!')

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  // Reset form
  const handleReset = () => {
    setLongUrl('')
    setShortUrl('')
    setCopied(false)
    setShowQRCode(false)
    setShowScanner(false)
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'qrcode' && shortUrl) {
      setShowQRCode(true)
    } else {
      setShowQRCode(false)
    }
  }

  // Redirect to dashboard if authenticated
  const handleGoToDashboard = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  const remainingLinks = getRemainingLinks()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
        {/* Authentication Status */}
        <AnimatePresence>
          {isAuthenticated ? (
            <motion.div 
              className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-800">Welcome back, {user?.name}!</h3>
                    <p className="text-green-600">Create unlimited links with premium features.</p>
                  </div>
                </div>
                <motion.button
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to Dashboard →
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">Create {remainingLinks} more temporary links</h3>
                    <p className="text-blue-600">
                      <button 
                        onClick={() => navigate('/login')}
                        className="text-blue-700 hover:text-blue-800 font-semibold underline"
                      >
                        Login
                      </button> to create unlimited links with analytics.
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Buttons */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-100 rounded-2xl p-2 flex shadow-inner">
            <motion.button
              onClick={() => handleTabChange('shortlink')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'shortlink'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Short Link
            </motion.button>
            <motion.button
              onClick={() => handleTabChange('qrcode')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'qrcode'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
              </svg>
              QR Code
            </motion.button>
          </div>
        </motion.div>

        {/* Scanner Button */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setShowScanner(true)}
            className="inline-flex items-center px-6 py-3 text-sm text-gray-600 hover:text-gray-800 font-medium bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Test QR Code Scanner
          </motion.button>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <motion.h3 
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {activeTab === 'shortlink' ? 'Shorten a long link' : 'Create QR Code for your link'}
            </motion.h3>
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {isAuthenticated 
                ? 'Create and manage your short links with advanced analytics' 
                : `Create temporary links (${remainingLinks} remaining)`
              }
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleShortUrl} className="space-y-8">
            {/* URL Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-4">
                Paste your long link here
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/my-long-url"
                  className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-200 text-lg bg-white/80 backdrop-blur-sm shadow-inner"
                  disabled={isLoading || (!isAuthenticated && !canCreateTempLink())}
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading || (!isAuthenticated && !canCreateTempLink())}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-5 px-8 rounded-2xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-xl hover:shadow-2xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    {activeTab === 'shortlink' ? 'Shortening URL...' : 'Generating QR Code...'}
                  </>
                ) : !isAuthenticated && !canCreateTempLink() ? (
                  'Login to Create More Links'
                ) : (
                  <>
                    {activeTab === 'shortlink' ? 'Get your link for free' : 'Generate QR Code'}
                    <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Result Section - Only show for short link tab */}
        <AnimatePresence>
          {shortUrl && activeTab === 'shortlink' && (
            <motion.div 
              className="mt-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">🎉</span>
                Your Shortened URL is Ready!
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-blue-600 font-bold text-lg shadow-inner"
                  />
                </div>

                <motion.button
                  onClick={handleCopyUrl}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                    copied
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </motion.button>
              </div>

              {/* Additional Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Test Link
                </motion.a>

                <motion.button
                  onClick={() => {
                    setActiveTab('qrcode')
                    setShowQRCode(true)
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 text-lg text-purple-600 hover:text-purple-800 font-semibold bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                  </svg>
                  Generate QR Code
                </motion.button>

                <motion.button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 text-lg text-gray-600 hover:text-gray-800 font-semibold bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Shorten Another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Result Section */}
        <AnimatePresence>
          {shortUrl && activeTab === 'qrcode' && (
            <motion.div 
              className="mt-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📱</span>
                QR Code Generated Successfully!
              </h3>
              
              <div className="text-center">
                <p className="text-gray-600 mb-6 text-lg">Your shortened URL: <span className="font-mono text-blue-600 font-bold">{shortUrl}</span></p>
                
                <motion.button
                  onClick={() => setShowQRCode(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center mx-auto shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                  </svg>
                  View & Download QR Code
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Modal */}
      {showQRCode && shortUrl && (
        <QRCodeGenerator
          url={shortUrl}
          onClose={() => setShowQRCode(false)}
        />
      )}

      {/* QR Code Scanner Modal */}
      {showScanner && (
        <QRCodeScanner
          onClose={() => setShowScanner(false)}
          onScan={(result) => {
            console.log('Scanned QR Code:', result)
            setShowScanner(false)
          }}
        />
      )}
    </div>
  )
}

export default UrlForm
