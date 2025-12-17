import React, { useState, useEffect } from 'react'
import { Link2, QrCode, MousePointerClick, TrendingUp, Plus, Copy, ExternalLink, Trash2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { urlService } from '../../services/url.service'
import { toast } from 'react-toastify'
import { reliableCopy } from '../../utils/helpers/clipboard'
import { motion } from 'framer-motion'

const DashboardHome = () => {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    qrScans: 0
  })
  const [recentLinks, setRecentLinks] = useState([])
  const [urlForm, setUrlForm] = useState({
    originalUrl: '',
    customAlias: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await urlService.getUserLinks()
      const links = response.data || []
      
      // Calculate stats
      const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)
      const activeLinks = links.filter(link => !link.disabled).length
      
      setStats({
        totalLinks: links.length,
        totalClicks,
        activeLinks,
        qrScans: 0 // Will be calculated from QR analytics
      })
      
      setRecentLinks(links.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLink = async (e) => {
    e.preventDefault()
    
    if (!urlForm.originalUrl) {
      toast.error('Please enter a URL')
      return
    }

    setIsCreating(true)
    try {
      const response = await urlService.createShortUrl(
        urlForm.originalUrl,
        urlForm.customAlias || null
      )

      if (response.success) {
        toast.success('Link created successfully!')
        setUrlForm({ originalUrl: '', customAlias: '' })
        fetchDashboardData()
        
        // Copy to clipboard automatically
        await reliableCopy(response.data.shortUrl)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create link')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteLink = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      await urlService.deleteUrl(id)
      toast.success('Link deleted successfully')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to delete link')
    }
  }

  const statCards = [
    {
      title: 'Total Links',
      value: stats.totalLinks,
      icon: Link2,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: 'purple',
      trend: '+23%'
    },
    {
      title: 'Active Links',
      value: stats.activeLinks,
      icon: TrendingUp,
      color: 'green',
      trend: '+8%'
    },
    {
      title: 'QR Scans',
      value: stats.qrScans,
      icon: QrCode,
      color: 'orange',
      trend: '+15%'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600'
          }

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${
                isDark ? 'bg-gray-900' : 'bg-white'
              } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.trend}</span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Create Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 p-6 rounded-2xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create New Link
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Shorten your URL instantly
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateLink} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Destination URL *
              </label>
              <input
                type="url"
                value={urlForm.originalUrl}
                onChange={(e) => setUrlForm({ ...urlForm, originalUrl: e.target.value })}
                placeholder="https://example.com/your-long-url"
                className={`w-full px-4 py-3 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Custom Alias (Optional)
              </label>
              <input
                type="text"
                value={urlForm.customAlias}
                onChange={(e) => setUrlForm({ ...urlForm, customAlias: e.target.value })}
                placeholder="my-custom-link"
                className={`w-full px-4 py-3 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isCreating ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </span>
              ) : (
                'Create Short Link'
              )}
            </button>
          </form>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent Links
          </h3>
          
          <div className="space-y-3">
            {recentLinks.length === 0 ? (
              <p className={`text-sm text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No links yet. Create your first one!
              </p>
            ) : (
              recentLinks.map((link, index) => (
                <div
                  key={link._id || link.id || `link-${index}`}
                  className={`p-3 rounded-lg ${
                    isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {link.clicks || 0} clicks
                    </span>
                  </div>
                  <p className={`text-sm font-medium truncate mb-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {link.shortUrl}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => reliableCopy(link.shortUrl)}
                      className="p-1 hover:bg-gray-700 rounded"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-700 rounded"
                      title="Open"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardHome
