import React, { useState, useEffect, useRef } from 'react'
import { QrCode, Download, Copy, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { urlService } from '../../services/url.service'
import { toast } from 'react-toastify'
import { reliableCopy } from '../../utils/helpers/clipboard'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'

const QRCodesPage = () => {
  const { isDark } = useTheme()
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLink, setSelectedLink] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    fetchLinks()
  }, [])

  useEffect(() => {
    if (selectedLink) {
      generateQRCode(selectedLink.shortUrl)
    }
  }, [selectedLink])

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

  const generateQRCode = async (url) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: isDark ? '#FFFFFF' : '#000000',
          light: isDark ? '#111827' : '#FFFFFF'
        }
      })
      setQrDataUrl(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    }
  }

  const downloadQRCode = () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.download = `qr-code-${selectedLink?.shortId || 'link'}.png`
    link.href = qrDataUrl
    link.click()
    toast.success('QR Code downloaded!')
  }

  const filteredLinks = links.filter(link =>
    link.shortUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.originalUrl?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          QR Codes
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Generate and download QR codes for your links
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Links List */}
        <div className={`lg:col-span-1 p-6 rounded-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="mb-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search links..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLinks.length === 0 ? (
              <p className={`text-sm text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No links found
              </p>
            ) : (
              filteredLinks.map((link) => (
                <motion.button
                  key={link._id}
                  onClick={() => setSelectedLink(link)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedLink?._id === link._id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : isDark
                      ? 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="font-medium text-sm truncate mb-1">
                    {link.shortUrl}
                  </p>
                  <p className={`text-xs truncate ${
                    selectedLink?._id === link._id ? 'text-blue-100' : isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {link.originalUrl}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs">
                      {link.clicks || 0} clicks
                    </span>
                    <QrCode className="w-4 h-4" />
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* QR Code Display */}
        <div className={`lg:col-span-2 p-6 rounded-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          {selectedLink ? (
            <div className="space-y-6">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  QR Code Preview
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedLink.shortUrl}
                </p>
              </div>

              <div className="flex justify-center">
                <div className={`p-8 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  {qrDataUrl && (
                    <img 
                      src={qrDataUrl} 
                      alt="QR Code" 
                      className="w-80 h-80 rounded-xl"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Download QR Code</span>
                </button>
                
                <button
                  onClick={() => reliableCopy(selectedLink.shortUrl)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border ${
                    isDark 
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  } transition-all`}
                >
                  <Copy className="w-5 h-5" />
                  <span>Copy Link</span>
                </button>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Link Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Original URL:
                    </span>
                    <span className={`text-sm font-medium truncate max-w-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedLink.originalUrl}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Clicks:
                    </span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedLink.clicks || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Status:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedLink.disabled
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {selectedLink.disabled ? 'Expired' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <QrCode className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Select a Link
              </h3>
              <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose a link from the list to generate its QR code
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QRCodesPage
