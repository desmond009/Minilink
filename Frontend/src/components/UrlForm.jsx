import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
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
        const { data } = await axios.post("http://localhost:3000/api/create", { 
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
        const tempShortUrl = `http://localhost:3000/${shortId}`
        
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
      <div className="bg-white rounded-lg shadow-xl p-8">
        {/* Authentication Status */}
        {isAuthenticated ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 font-medium">Welcome back, {user?.name}! Create unlimited links.</span>
              </div>
              <button
                onClick={handleGoToDashboard}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-700">
                  You can create {remainingLinks} more temporary links. 
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                  >
                    Login
                  </button> to create unlimited links.
                </span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => handleTabChange('shortlink')}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center ${
                activeTab === 'shortlink'
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Short link
            </button>
            <button
              onClick={() => handleTabChange('qrcode')}
              className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center ${
                activeTab === 'qrcode'
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
              </svg>
              QR Code
            </button>
          </div>
        </div>

        {/* Scanner Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowScanner(true)}
            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Test QR Code Scanner
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'shortlink' ? 'Shorten a long link' : 'Create QR Code for your link'}
            </h3>
            <p className="text-gray-600">
              {isAuthenticated 
                ? 'Create and manage your short links' 
                : `Create temporary links (${remainingLinks} remaining)`
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleShortUrl} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Paste your long link here
              </label>
              <input
                type="url"
                id="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/my-long-url"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
                disabled={isLoading || (!isAuthenticated && !canCreateTempLink())}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!isAuthenticated && !canCreateTempLink())}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {activeTab === 'shortlink' ? 'Shortening URL...' : 'Generating QR Code...'}
                </>
              ) : !isAuthenticated && !canCreateTempLink() ? (
                'Login to Create More Links'
              ) : (
                <>
                  {activeTab === 'shortlink' ? 'Get your link for free' : 'Generate QR Code'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Section - Only show for short link tab */}
        {shortUrl && activeTab === 'shortlink' && (
          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Shortened URL:
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-blue-600 font-medium"
                />
              </div>

              <button
                onClick={handleCopyUrl}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Additional Actions */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Test Link
              </a>

              <button
                onClick={() => {
                  setActiveTab('qrcode')
                  setShowQRCode(true)
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                </svg>
                Generate QR Code
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Shorten Another
              </button>
            </div>
          </div>
        )}

        {/* QR Code Result Section */}
        {shortUrl && activeTab === 'qrcode' && (
          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              QR Code Generated Successfully!
            </h3>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">Your shortened URL: <span className="font-mono text-blue-600">{shortUrl}</span></p>
              
              <button
                onClick={() => setShowQRCode(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center mx-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                </svg>
                View & Download QR Code
              </button>
            </div>
          </div>
        )}
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
