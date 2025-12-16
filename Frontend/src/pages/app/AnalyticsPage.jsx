import React, { useState, useEffect } from 'react'
import { TrendingUp, MousePointerClick, Globe, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { urlService } from '../../services/url.service'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const AnalyticsPage = () => {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)
  const [links, setLinks] = useState([])
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await urlService.getUserLinks()
      setLinks(response.data || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)
  const totalLinks = links.length
  const activeLinks = links.filter(link => !link.disabled).length
  const avgClicksPerLink = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0

  // Generate chart data
  const clicksData = [
    { name: 'Mon', clicks: Math.floor(Math.random() * 100) + 50 },
    { name: 'Tue', clicks: Math.floor(Math.random() * 100) + 50 },
    { name: 'Wed', clicks: Math.floor(Math.random() * 100) + 50 },
    { name: 'Thu', clicks: Math.floor(Math.random() * 100) + 50 },
    { name: 'Fri', clicks: Math.floor(Math.random() * 100) + 50 },
    { name: 'Sat', clicks: Math.floor(Math.random() * 100) + 50 },
    { name: 'Sun', clicks: Math.floor(Math.random() * 100) + 50 },
  ]

  // Top performing links
  const topLinks = [...links]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5)

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

  const statCards = [
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: 'blue',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Active Links',
      value: activeLinks,
      icon: TrendingUp,
      color: 'green',
      change: '+8.2%',
      isPositive: true
    },
    {
      title: 'Avg Clicks/Link',
      value: avgClicksPerLink,
      icon: Globe,
      color: 'purple',
      change: '+5.1%',
      isPositive: true
    },
    {
      title: 'This Week',
      value: clicksData.reduce((sum, day) => sum + day.clicks, 0),
      icon: Calendar,
      color: 'orange',
      change: '-2.3%',
      isPositive: false
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Analytics
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your link performance and insights
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
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
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  stat.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Clicks Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clicksData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="name" 
                stroke={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  color: isDark ? '#FFFFFF' : '#000000'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Performing Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Top Performing Links
          </h3>
          <div className="space-y-4">
            {topLinks.length === 0 ? (
              <p className={`text-sm text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No data available
              </p>
            ) : (
              topLinks.map((link, index) => (
                <div
                  key={link._id}
                  className={`p-4 rounded-xl ${
                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                  } transition-colors hover:scale-105 transform duration-200`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${COLORS[index] || '#3B82F6'}`}
                        style={{ background: COLORS[index] }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {link.shortUrl}
                        </p>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {link.originalUrl}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {link.clicks || 0}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        clicks
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{
                        width: `${totalClicks > 0 ? ((link.clicks || 0) / totalClicks) * 100 : 0}%`
                      }}
                    ></div>
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

export default AnalyticsPage
