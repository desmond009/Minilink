import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTempLinks } from '../context/TempLinksContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import QRCodeGenerator from './QRCodeGenerator'
import QRCodeScanner from './QRCodeScanner'
import { reliableCopy } from '../utils/clipboard'
import { Link as LinkIcon, Copy, QrCode, Loader, CheckCircle2, ExternalLink } from 'lucide-react'
import API_BASE_URL from '../api/config'

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [recentLinks, setRecentLinks] = useState([])
  
  const { isAuthenticated, user } = useAuth()
  const { isDark } = useTheme()
  const { 
    tempLinks, 
    addTempLink, 
    canCreateTempLink, 
    getRemainingLinks, 
    MAX_TEMP_LINKS 
  } = useTempLinks()
  const navigate = useNavigate()

  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  useEffect(() => {
    if (shortUrl && isAuthenticated) {
      setRecentLinks([
        { original: longUrl, short: shortUrl, timestamp: new Date() },
        ...recentLinks.slice(0, 4)
      ])
    }
  }, [shortUrl, isAuthenticated])

  const handleShortUrl = async (e) => {
    e.preventDefault()
    
    if (!longUrl.trim()) {
      toast.error('Please enter a valid URL')
      return
    }

    if (!isAuthenticated && !canCreateTempLink()) {
      toast.info(`You can create up to ${MAX_TEMP_LINKS} links without login. Please login to create more links.`)
      navigate('/login')
      return
    }
    
    setIsLoading(true)

    try {
      if (isAuthenticated) {
        const { data } = await axios.post(API_BASE_URL + "/create", { 
          originalUrl: longUrl 
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        setShortUrl(data.data.shortUrl)
        toast.success('URL shortened successfully!')
      } else {
        const shortId = generateShortId()
        const tempShortUrl = (import.meta.env.VITE_SHORT_BASE_URL || 'https://mini.lk') + `/${shortId}`
        
        addTempLink(longUrl, tempShortUrl, shortId)
        setShortUrl(tempShortUrl)
        toast.success('URL shortened! Login to save permanently')
      }
    } catch (error) {
      console.error('Error creating short URL:', error)
      toast.error(error.response?.data?.message || 'Failed to shorten URL. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await reliableCopy(shortUrl)
      setCopied(true)
      toast.success('Copied to clipboard!')

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleReset = () => {
    setLongUrl('')
    setShortUrl('')
    setCopied(false)
    setShowQRCode(false)
    setShowScanner(false)
  }

  const truncateUrl = (url, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Main Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`rounded-2xl shadow-2xl backdrop-blur-xl border transition-colors duration-300 overflow-hidden ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/50 border-slate-200/50'
          }`}
        >
          {/* Header Section */}
          <div className={`p-8 border-b transition-colors duration-300 ${
            isDark ? 'border-slate-700/50' : 'border-slate-200/50'
          }`}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-2`}
            >
              Shorten Your Links
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Create short, memorable links in seconds
            </motion.p>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            <form onSubmit={handleShortUrl} className="space-y-4">
              {/* URL Input */}
              <div className="relative">
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Enter your long URL
                </label>
                <div className="relative">
                  <LinkIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} size={20} />
                  <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://example.com/your-very-long-url"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 text-base placeholder-opacity-60 focus:outline-none ${
                      isDark
                        ? 'bg-slate-900/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  type="submit"
                  disabled={isLoading || !longUrl.trim()}
                  whileHover={{ scale: isLoading || !longUrl.trim() ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading || !longUrl.trim() ? 1 : 0.98 }}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLoading || !longUrl.trim()
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30'
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Shortening...</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon size={20} />
                      <span>Shorten URL</span>
                    </>
                  )}
                </motion.button>

                {shortUrl && (
                  <motion.button
                    type="button"
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                      isDark
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700/50'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    New Link
                  </motion.button>
                )}
              </div>
            </form>

            {/* Result Card */}
            <AnimatePresence>
              {shortUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={`rounded-xl border-2 p-6 transition-colors duration-300 ${
                    isDark
                      ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-6">
                    <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={24} />
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${
                        isDark ? 'text-green-400' : 'text-green-700'
                      }`}>
                        Link Created Successfully!
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-green-300/70' : 'text-green-600/70'
                      }`}>
                        {isAuthenticated ? 'Your link has been saved.' : 'This is a temporary link.'}
                      </p>
                    </div>
                  </div>

                  {/* URL Display */}
                  <div className="space-y-4">
                    {/* Original URL */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Original URL
                      </label>
                      <p className={`text-sm font-medium break-all ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {truncateUrl(longUrl, 50)}
                      </p>
                    </div>

                    {/* Short URL */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Short URL
                      </label>
                      <div className="flex items-center space-x-3">
                        <code className={`flex-1 px-4 py-3 rounded-lg font-mono text-base font-semibold break-all transition-colors duration-300 ${
                          isDark
                            ? 'bg-slate-900/50 text-indigo-400'
                            : 'bg-slate-100 text-indigo-600'
                        }`}>
                          {shortUrl}
                        </code>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <motion.button
                        onClick={handleCopyUrl}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          copied
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                            : isDark
                              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30'
                              : 'bg-indigo-100 text-indigo-600 border border-indigo-200 hover:bg-indigo-200'
                        }`}
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 size={18} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            <span>Copy Link</span>
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        onClick={() => setShowQRCode(!showQRCode)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 border ${
                          isDark
                            ? 'bg-purple-600/20 text-purple-400 border-purple-500/30 hover:bg-purple-600/30'
                            : 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200'
                        }`}
                      >
                        <QrCode size={18} />
                        <span>{showQRCode ? 'Hide' : 'Show'} QR Code</span>
                      </motion.button>

                      <motion.a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 border ${
                          isDark
                            ? 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <ExternalLink size={18} />
                        <span>Visit</span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* QR Code Display */}
            <AnimatePresence>
              {showQRCode && shortUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl p-8 flex flex-col items-center justify-center transition-colors duration-300 ${
                    isDark
                      ? 'bg-slate-900/50 border border-slate-700/50'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <QRCodeGenerator value={shortUrl} />
                  <p className={`mt-4 text-sm font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Scan to visit your shortened link
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Links Section */}
            {isAuthenticated && recentLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`rounded-xl border-2 p-6 transition-colors duration-300 ${
                  isDark
                    ? 'bg-slate-900/30 border-slate-700/50'
                    : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
                  <span>Recent Links</span>
                </h3>
                <div className="space-y-3">
                  {recentLinks.slice(0, 3).map((link, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${
                        isDark
                          ? 'bg-slate-800/50 hover:bg-slate-800'
                          : 'bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                          isDark ? 'text-slate-500' : 'text-slate-600'
                        }`}>
                          {truncateUrl(link.original, 35)}
                        </p>
                        <p className={`text-sm font-mono ${
                          isDark ? 'text-indigo-400' : 'text-indigo-600'
                        }`}>
                          {link.short}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          reliableCopy(link.short)
                          toast.success('Copied!')
                        }}
                        className={`p-2 rounded-lg transition-colors duration-200 ml-2 flex-shrink-0 ${
                          isDark
                            ? 'hover:bg-slate-700 text-slate-400'
                            : 'hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Copy size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 text-center"
        >
          {[
            { label: 'Links Created', value: '1M+' },
            { label: 'Active Users', value: '500K+' },
            { label: 'Uptime', value: '99.9%' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-colors duration-300 ${
                isDark
                  ? 'bg-slate-800/50 border border-slate-700/50'
                  : 'bg-white/50 border border-slate-200/50'
              }`}
            >
              <p className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className={`text-sm font-medium mt-1 transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default UrlForm
