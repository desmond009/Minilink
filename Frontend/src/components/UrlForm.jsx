import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)


  const queryClient = useQueryClient()

  // Validate URL format
//   const isValidUrl = (string) => {
//     try {
//       new URL(string)
//       return true
//     } catch (_) {
//       return false
//     }
//   }

  // Handle URL shortening
    const handleShortUrl = async (e) => {
        e.preventDefault();

        const {data} = await axios.post("http://localhost:3000/api/create", {url: longUrl})

        setShortUrl(data.URL)
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
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            URL Shortener
          </h2>
          <p className="text-gray-600">
            Enter a long URL and get a shortened version instantly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleShortUrl} className="space-y-6">
          {/* URL Input */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Long URL
            </label>
            <input
              type="url"
              id="url"
              value={longUrl}
              onInput={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/very-long-url..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Shortening URL...
              </div>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>

        {/* Result Section */}
        {shortUrl && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Shortened URL:
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium"
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
      </div>
    </div>
  )
}

export default UrlForm
