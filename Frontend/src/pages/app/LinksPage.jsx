import React, { useState, useEffect } from 'react'
import { Search, Copy, ExternalLink, Trash2, Edit2, BarChart2, QrCode, Filter, Download } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { urlService } from '../../services/url.service'
import { toast } from 'react-toastify'
import { reliableCopy } from '../../utils/helpers/clipboard'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const LinksPage = () => {
  const { isDark } = useTheme()
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedLink, setSelectedLink] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await urlService.getUserLinks()
      setLinks(response.data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
      toast.error('Failed to fetch links')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      await urlService.deleteUrl(id)
      toast.success('Link deleted successfully')
      fetchLinks()
    } catch (error) {
      toast.error('Failed to delete link')
    }
  }

  const filteredLinks = links.filter(link => {
    const matchesSearch = 
      link.shortUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.customAlias?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && !link.disabled) ||
      (filterStatus === 'expired' && link.disabled)
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            My Links
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage all your shortened URLs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className={`px-4 py-2 rounded-xl border ${
            isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'
          } transition-colors`}>
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-2xl ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by URL, alias, or custom name..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            >
              <option value="all">All Links</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div className={`rounded-2xl overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Short URL
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Original URL
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Clicks
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Created
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        No links found
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link, index) => (
                  <motion.tr
                    key={link._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-medium hover:underline ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}
                        >
                          {link.shortUrl}
                        </a>
                        <button
                          onClick={() => reliableCopy(link.shortUrl)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`truncate max-w-xs text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {link.originalUrl}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <BarChart2 className="w-4 h-4 text-purple-500" />
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {link.clicks || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {link.createdAt ? format(new Date(link.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        link.disabled
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {link.disabled ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(link.shortUrl, '_blank')}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Open"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(link._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LinksPage
