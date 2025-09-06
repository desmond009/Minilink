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
      const response = await axios.get('http://localhost:3000/api/create/links', {
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
      const response = await axios.post('http://localhost:3000/api/create', {
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
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Quick Create Section */}
            <div className="max-w-4xl">
              <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} p-8 mb-8`}>
                <div className="flex items-center mb-6">
                  <AnimatedLogo />
                  <div className="ml-4">
                    <motion.h2 
                      className={`text-2xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Quick Create
                    </motion.h2>
                    <motion.p 
                      className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Transform your long URLs into short, shareable links
                    </motion.p>
                  </div>
                </div>
                
                <form onSubmit={handleCreateLink} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                        🌐 Domain: localhost:3000
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={urlForm.customAlias}
                          onChange={(e) => setUrlForm({...urlForm, customAlias: e.target.value})}
                          placeholder="Custom alias (optional)"
                          className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-gray-400">🔒</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                        📎 Enter your destination URL
                      </label>
                      <input
                        type="url"
                        value={urlForm.originalUrl}
                        onChange={(e) => setUrlForm({...urlForm, originalUrl: e.target.value})}
                        placeholder="https://example.com/my-long-url"
                        className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm`}
                        required
                      />
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-center">
                    <FloatingButton
                      type="submit"
                      disabled={isCreating}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                      {isCreating ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
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
                  
                  <div className="flex justify-center space-x-6">
                    <label className="flex items-center cursor-pointer group">
                      <input type="radio" name="type" value="link" defaultChecked className="mr-3 w-4 h-4 text-blue-600" />
                      <span className={`${isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'} transition-colors`}>🔗 Short link</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input type="radio" name="type" value="qr" className="mr-3 w-4 h-4 text-purple-600" />
                      <span className={`${isDark ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-700 group-hover:text-purple-600'} transition-colors`}>📱 QR Code</span>
                    </label>
                  </div>
                </form>

                {/* Show created link and QR code */}
                <AnimatePresence>
                  {createdLink && (
                    <motion.div 
                      className={`mt-8 p-6 ${isDark ? 'bg-green-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/90 to-blue-50/90 border-green-200/50'} backdrop-blur-sm rounded-xl border-2`}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                        <span className="mr-2">🎉</span>
                        Your Shortened URL is Ready!
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={createdLink.shortUrl}
                            readOnly
                            className={`flex-1 px-4 py-3 ${isDark ? 'bg-gray-800/80 border-gray-600 text-blue-400' : 'bg-white/80 border-blue-200 text-blue-600'} border-2 rounded-xl font-bold text-lg shadow-inner backdrop-blur-sm`}
                          />
                          <motion.button
                            onClick={() => copyToClipboard(createdLink.shortUrl)}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            📋 Copy
                          </motion.button>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <motion.a
                            href={createdLink.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-2">🔗</span>
                            Test Link
                          </motion.a>
                          
                          <motion.button
                            onClick={() => setShowQRCode(true)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-2">📱</span>
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
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-xl rounded-2xl p-8 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-2">�� Your Links</h2>
              <p className="text-blue-100">Manage and track all your shortened URLs</p>
            </motion.div>

            <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} overflow-hidden`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700/50 bg-gray-700/30' : 'border-gray-200/50 bg-gradient-to-r from-gray-50/90 to-blue-50/90'} backdrop-blur-sm`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>📊 Link History</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="🔍 Search links..."
                        className={`px-4 py-2 border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 w-64 backdrop-blur-sm`}
                      />
                    </div>
                    <select className={`px-4 py-2 border-2 ${isDark ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-white/80'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm`}>
                      <option>📅 All time</option>
                      <option>📅 Last 7 days</option>
                      <option>📅 Last 30 days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`divide-y ${isDark ? 'divide-gray-700/50' : 'divide-gray-100/50'}`}>
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>Loading your amazing links...</p>
                  </div>
                ) : links.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className={`w-24 h-24 ${isDark ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-200'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <span className="text-4xl">🔗</span>
                    </div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No links created yet</h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Create your first magical link above! ✨</p>
                  </div>
                ) : (
                  links.map((link, index) => (
                    <motion.div 
                      key={link._id} 
                      className={`p-6 ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50'} transition-all duration-300 group`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'} truncate mb-1`}>
                              {link.long_url}
                            </p>
                            <p className="text-lg font-bold text-blue-600 mb-1">
                              localhost:3000/{link.short_id}
                            </p>
                            <div className={`flex items-center space-x-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>📅 {new Date(link.createdAt).toLocaleDateString()}</span>
                              <span>👆 {link.clickCount || 0} clicks</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => copyToClipboard(`localhost:3000/${link.short_id}`)}
                            className={`p-3 ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-600/50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'} rounded-xl transition-all duration-200`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Copy link"
                          >
                            <span className="text-xl">📋</span>
                          </motion.button>
                          <motion.button 
                            className={`p-3 ${isDark ? 'text-gray-400 hover:text-green-400 hover:bg-gray-600/50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'} rounded-xl transition-all duration-200`}
                            title="Share"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="text-xl">📤</span>
                          </motion.button>
                          <motion.button 
                            className={`p-3 ${isDark ? 'text-gray-400 hover:text-purple-400 hover:bg-gray-600/50' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'} rounded-xl transition-all duration-200`}
                            title="Settings"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="text-xl">⚙️</span>
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
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-purple-500/90 to-pink-600/90 backdrop-blur-xl rounded-2xl p-8 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-2">📱 QR Codes</h2>
              <p className="text-purple-100">Generate and manage QR codes for your links</p>
            </motion.div>

            <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} p-8`}>
              <div className="text-center">
                <div className={`w-32 h-32 ${isDark ? 'bg-gray-700' : 'bg-gradient-to-r from-purple-100 to-pink-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-6xl">📱</span>
                </div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>QR Code Generator</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>Create QR codes for your shortened URLs to make them easily scannable</p>
                
                {links.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.slice(0, 6).map((link, index) => (
                      <motion.div 
                        key={link._id} 
                        className={`${isDark ? 'bg-gray-700/50 border-gray-600/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50'} backdrop-blur-sm rounded-xl p-6 border hover:shadow-lg transition-all duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-center">
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 truncate`}>{link.long_url}</p>
                          <p className="font-bold text-blue-600 mb-4">localhost:3000/{link.short_id}</p>
                          <motion.button
                            onClick={() => setShowQRCode(true)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
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
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>No links available to generate QR codes</p>
                    <motion.button
                      onClick={() => setActiveTab('home')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
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
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-green-500/90 to-teal-600/90 backdrop-blur-xl rounded-2xl p-8 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-2">📊 Analytics</h2>
              <p className="text-green-100">Track your link performance and insights</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Total Links', value: links.length, icon: '🔗', color: 'blue' },
                { title: 'Total Clicks', value: links.reduce((total, link) => total + (link.clickCount || 0), 0), icon: '👆', color: 'green' },
                { title: 'Avg. Clicks', value: links.length > 0 ? Math.round(links.reduce((total, link) => total + (link.clickCount || 0), 0) / links.length) : 0, icon: '📈', color: 'purple' }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.title}
                  className={`${isDark ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-white/20'} backdrop-blur-xl rounded-2xl shadow-2xl border p-6`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{stat.title}</p>
                      <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <span className="text-2xl">{stat.icon}</span>
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
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-gray-600/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-2">⚙️ Settings</h2>
              <p className="text-gray-300">Customize your MiniLink experience</p>
            </motion.div>

            <AnimatedCard className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl shadow-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/20'} p-8`}>
              <div className="space-y-6">
                <div className={`flex items-center justify-between p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50/80'} backdrop-blur-sm rounded-xl`}>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>🌙 Dark Mode</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Switch to dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isDark}
                      onChange={toggleTheme}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className={`flex items-center justify-between p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50/80'} backdrop-blur-sm rounded-xl`}>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>🔔 Notifications</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Get notified about link activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className={`p-4 ${isDark ? 'bg-red-900/30 border-red-700/50' : 'bg-red-50/80 border-red-200/50'} backdrop-blur-sm rounded-xl border`}>
                  <h3 className="font-semibold text-red-900 mb-2">🚨 Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">These actions cannot be undone</p>
                  <motion.button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
        className={`fixed inset-y-0 left-0 w-72 ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl shadow-2xl border-r ${isDark ? 'border-gray-700/50' : 'border-white/20'} z-20`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <AnimatedLogo />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'} ml-4`}>MiniLink</span>
          </div>

          {/* Create New Button */}
          <FloatingButton 
            onClick={() => setActiveTab('home')}
            className="w-full text-white py-4 px-6 rounded-2xl font-bold text-lg mb-8"
          >
            <span className="mr-2">✨</span>
            Create New
          </FloatingButton>

          {/* Navigation */}
          <nav className="space-y-3">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
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
                <span className="text-2xl mr-4">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="ml-72">
        {/* Header */}
        <motion.header 
          className={`${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl shadow-lg border-b ${isDark ? 'border-gray-700/50' : 'border-white/20'} sticky top-0 z-10`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="px-8 py-6 flex items-center justify-between">
            <motion.h1 
              className={`text-3xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {activeTab === 'home' && '🏠 Dashboard'}
              {activeTab === 'links' && '🔗 Links'}
              {activeTab === 'qrcodes' && '📱 QR Codes'}
              {activeTab === 'analytics' && '📊 Analytics'}
              {activeTab === 'settings' && '⚙️ Settings'}
            </motion.h1>
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`flex items-center space-x-3 ${isDark ? 'bg-gray-700/80' : 'bg-gradient-to-r from-gray-100/80 to-blue-100/80'} backdrop-blur-sm rounded-2xl px-4 py-2`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'User'}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Premium User</p>
                </div>
                <motion.button
                  onClick={logout}
                  className={`p-2 ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'} rounded-xl transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xl">🚪</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="p-8">
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
