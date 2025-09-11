import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeGenerator from '../components/QRCodeGenerator'
import ThreeBackground from '../components/ThreeBackground'
import AnimatedLogo from '../components/AnimatedLogo'
import FloatingButton from '../components/FloatingButton'
import AnimatedCard from '../components/AnimatedCard'
import { reliableCopy } from '../utils/clipboard'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [urlForm, setUrlForm] = useState({
    originalUrl: '',
    customAlias: ''
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createdLink, setCreatedLink] = useState(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // Fetch user's links
  const fetchLinks = async () => {
    try {
      const response = await axios.get((import.meta.env.VITE_API_URL + '/create/links'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setLinks(response.data.data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
      toast.error('Failed to fetch links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  // Create new short link
  const handleCreateLink = async (e) => {
    e.preventDefault()
    if (!urlForm.originalUrl) {
      toast.error('Please enter a URL')
      return
    }

    setIsCreating(true)
    try {
      const response = await axios.post((import.meta.env.VITE_API_URL + '/create'), {
        originalUrl: urlForm.originalUrl,
        customAlias: urlForm.customAlias || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.data.success) {
        toast.success('Link created successfully!')
        setCreatedLink(response.data.data)
        setUrlForm({ originalUrl: '', customAlias: '' })
        fetchLinks() // Refresh the links list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create link')
    } finally {
      setIsCreating(false)
    }
  }

  // Copy link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'links', label: 'Links', icon: '🔗' },
    { id: 'qrcodes', label: 'QR Codes', icon: '📱' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Quick Create Section */}
            <div className="max-w-4xl">
              <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} p-6 mb-6`}>
                <div className="flex items-center mb-4">
                  <AnimatedLogo />
                  <div className="ml-3">
                    <motion.h2 
                      className={`text-lg font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Quick Create
                    </motion.h2>
                    <motion.p 
                      className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Transform your long URLs into short, shareable links
                    </motion.p>
                  </div>
                </div>
                
                <form onSubmit={handleCreateLink} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className={`block text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        🌐 Domain: localhost:3000
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={urlForm.customAlias}
                          onChange={(e) => setUrlForm({...urlForm, customAlias: e.target.value})}
                          placeholder="Custom alias (optional)"
                          className={`w-full px-3 py-2 text-sm border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm`}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <span className="text-gray-400 text-xs">🔒</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className={`block text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        📎 Enter your destination URL
                      </label>
                      <input
                        type="url"
                        value={urlForm.originalUrl}
                        onChange={(e) => setUrlForm({...urlForm, originalUrl: e.target.value})}
                        placeholder="https://example.com/my-long-url"
                        className={`w-full px-3 py-2 text-sm border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm`}
                        required
                      />
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-center">
                    <FloatingButton
                      type="submit"
                      disabled={isCreating}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-3 px-6 rounded-lg font-bold text-sm hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                      {isCreating ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating Magic...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="mr-2">✨</span>
                          Create your MiniLink
                        </div>
                      )}
                    </FloatingButton>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <label className="flex items-center cursor-pointer group">
                      <input type="radio" name="type" value="link" defaultChecked className="mr-2 w-3 h-3 text-blue-600" />
                      <span className={`text-xs ${isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'} transition-colors`}>🔗 Short link</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input type="radio" name="type" value="qr" className="mr-2 w-3 h-3 text-purple-600" />
                      <span className={`text-xs ${isDark ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-700 group-hover:text-purple-600'} transition-colors`}>📱 QR Code</span>
                    </label>
                  </div>
                </form>

                {/* Show created link and QR code */}
                <AnimatePresence>
                  {createdLink && (
                    <motion.div 
                      className={`mt-6 p-4 ${isDark ? 'bg-green-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/90 to-blue-50/90 border-green-200/50'} backdrop-blur-sm rounded-lg border-2`}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center`}>
                        <span className="mr-2">🎉</span>
                        Your Shortened URL is Ready!
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={createdLink.shortUrl}
                            readOnly
                            className={`flex-1 px-3 py-2 text-sm ${isDark ? 'bg-gray-800/80 border-gray-600 text-blue-400' : 'bg-white/80 border-blue-200 text-blue-600'} border-2 rounded-lg font-bold shadow-inner backdrop-blur-sm`}
                          />
                          <motion.button
                            onClick={async () => { await reliableCopy(createdLink.shortUrl); }}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold text-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            📋 Copy
                          </motion.button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <motion.a
                            href={createdLink.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md font-medium text-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-1">🔗</span>
                            Test Link
                          </motion.a>
                          
                          <motion.button
                            onClick={() => setShowQRCode(true)}
                            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md font-medium text-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-1">📱</span>
                            Generate QR Code
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimatedCard>
            </div>
          </motion.div>
        )

      case 'links':
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-xl rounded-xl p-6 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-1">🔗 Your Links</h2>
              <p className="text-blue-100 text-sm">Manage and track all your shortened URLs</p>
            </motion.div>

            <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} overflow-hidden`}>
              <div className={`p-4 border-b ${isDark ? 'border-gray-700/50 bg-gray-700/30' : 'border-gray-200/50 bg-gradient-to-r from-gray-50/90 to-blue-50/90'} backdrop-blur-sm`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>📊 Link History</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="🔍 Search links..."
                        className={`px-3 py-1 text-sm border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 w-48 backdrop-blur-sm`}
                      />
                    </div>
                    <select className={`px-3 py-1 text-sm border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm`}>
                      <option>📅 All time</option>
                      <option>📅 Last 7 days</option>
                      <option>📅 Last 30 days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`divide-y ${isDark ? 'divide-gray-700/50' : 'divide-gray-100/50'}`}>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Loading your amazing links...</p>
                  </div>
                ) : links.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className={`w-16 h-16 ${isDark ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-200'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl">🔗</span>
                    </div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>No links created yet</h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Create your first magical link above! ✨</p>
                  </div>
                ) : (
                  links.map((link, index) => (
                    <motion.div 
                      key={link._id} 
                      className={`p-4 ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50'} transition-all duration-300 group`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'} truncate mb-1`}>
                              {link.long_url}
                            </p>
                            <p className="text-sm font-bold text-blue-600 mb-1">
                              localhost:3000/{link.short_id}
                            </p>
                            <div className={`flex items-center space-x-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>📅 {new Date(link.createdAt).toLocaleDateString()}</span>
                              <span>👆 {link.clickCount || 0} clicks</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <motion.button
                            onClick={() => copyToClipboard(`localhost:3000/${link.short_id}`)}
                            className={`p-2 ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-600/50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'} rounded-lg transition-all duration-200`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Copy link"
                          >
                            <span className="text-sm">📋</span>
                          </motion.button>
                          <motion.button 
                            className={`p-2 ${isDark ? 'text-gray-400 hover:text-green-400 hover:bg-gray-600/50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'} rounded-lg transition-all duration-200`}
                            title="Share"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="text-sm">📤</span>
                          </motion.button>
                          <motion.button 
                            className={`p-2 ${isDark ? 'text-gray-400 hover:text-purple-400 hover:bg-gray-600/50' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'} rounded-lg transition-all duration-200`}
                            title="Settings"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="text-sm">⚙️</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </AnimatedCard>
          </motion.div>
        )

      case 'qrcodes':
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-purple-500/90 to-pink-600/90 backdrop-blur-xl rounded-xl p-6 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-1">📱 QR Codes</h2>
              <p className="text-purple-100 text-sm">Generate and manage QR codes for your links</p>
            </motion.div>

            <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} p-6`}>
              <div className="text-center">
                <div className={`w-24 h-24 ${isDark ? 'bg-gray-700' : 'bg-gradient-to-r from-purple-100 to-pink-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-4xl">📱</span>
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>QR Code Generator</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 text-sm`}>Create QR codes for your shortened URLs to make them easily scannable</p>
                
                {links.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {links.slice(0, 6).map((link, index) => (
                      <motion.div 
                        key={link._id} 
                        className={`${isDark ? 'bg-gray-700/50 border-gray-600/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50'} backdrop-blur-sm rounded-lg p-4 border hover:shadow-lg transition-all duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-center">
                          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 truncate`}>{link.long_url}</p>
                          <p className="font-bold text-blue-600 mb-3 text-sm">localhost:3000/{link.short_id}</p>
                          <motion.button
                            onClick={() => setShowQRCode(true)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium text-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            📱 Generate QR
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-3 text-sm`}>No links available to generate QR codes</p>
                    <motion.button
                      onClick={() => setActiveTab('home')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create Your First Link
                    </motion.button>
                  </div>
                )}
              </div>
            </AnimatedCard>
          </motion.div>
        )

      case 'analytics':
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-green-500/90 to-teal-600/90 backdrop-blur-xl rounded-xl p-6 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-1">📊 Analytics</h2>
              <p className="text-green-100 text-sm">Track your link performance and insights</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Total Links', value: links.length, icon: '🔗', color: 'blue' },
                { title: 'Total Clicks', value: links.reduce((total, link) => total + (link.clickCount || 0), 0), icon: '👆', color: 'green' },
                { title: 'Avg. Clicks', value: links.length > 0 ? Math.round(links.reduce((total, link) => total + (link.clickCount || 0), 0) / links.length) : 0, icon: '📈', color: 'purple' }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.title}
                  className={`${isDark ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-white/20'} backdrop-blur-xl rounded-xl shadow-2xl border p-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-xs`}>{stat.title}</p>
                      <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case 'settings':
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-gray-600/90 to-gray-800/90 backdrop-blur-xl rounded-xl p-6 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-1">⚙️ Settings</h2>
              <p className="text-gray-300 text-sm">Customize your MiniLink experience</p>
            </motion.div>

            <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} p-6`}>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50/80'} backdrop-blur-sm rounded-lg`}>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>🌙 Dark Mode</h3>
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Switch to dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isDark}
                      onChange={toggleTheme}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className={`flex items-center justify-between p-3 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50/80'} backdrop-blur-sm rounded-lg`}>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>🔔 Notifications</h3>
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Get notified about link activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className={`p-3 ${isDark ? 'bg-red-900/30 border-red-700/50' : 'bg-red-50/80 border-red-200/50'} backdrop-blur-sm rounded-lg border`}>
                  <h3 className="font-semibold text-red-900 mb-1 text-sm">🚨 Danger Zone</h3>
                  <p className="text-xs text-red-700 mb-3">These actions cannot be undone</p>
                  <motion.button
                    onClick={logout}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'} relative overflow-hidden transition-colors duration-300`}>
      {/* 3D Background */}
      <ThreeBackground />
      
      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 w-64 ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl shadow-2xl border-r ${isDark ? 'border-gray-700/50' : 'border-white/20'} z-20`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <AnimatedLogo />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'} ml-3`}>MiniLink</span>
          </div>

          {/* Create New Button */}
          <FloatingButton 
            onClick={() => setActiveTab('home')}
            className="w-full text-white py-3 px-4 rounded-xl font-bold text-sm mb-6"
          >
            <span className="mr-2">✨</span>
            Create New
          </FloatingButton>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center py-3 px-4 rounded-xl font-medium transition-all duration-300 text-sm ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : isDark 
                      ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:text-blue-600'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <motion.header 
          className={`${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl shadow-lg border-b ${isDark ? 'border-gray-700/50' : 'border-white/20'} sticky top-0 z-10`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <motion.h1 
              className={`text-xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {activeTab === 'home' && '🏠 Your connection platform'}
              {activeTab === 'links' && '🔗 Links'}
              {activeTab === 'qrcodes' && '📱 QR Codes'}
              {activeTab === 'analytics' && '📊 Analytics'}
              {activeTab === 'settings' && '⚙️ Settings'}
            </motion.h1>
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={`p-2 ${isDark ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-900/20' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'} rounded-lg transition-all duration-200`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.button>
              
              <motion.div 
                className={`flex items-center space-x-2 ${isDark ? 'bg-gray-700/80' : 'bg-gradient-to-r from-gray-100/80 to-blue-100/80'} backdrop-blur-sm rounded-xl px-3 py-2`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'User'}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Premium User</p>
                </div>
                <motion.button
                  onClick={logout}
                  className={`p-1 ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'} rounded-lg transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm">🚪</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.header>


        {/* Main Content Area */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>

      {/* QR Code Modal */}
      {showQRCode && createdLink && (
        <QRCodeGenerator
          url={createdLink.shortUrl}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
