import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import Profile from '../pages/Profile'
import LoginSuccess from '../pages/LoginSuccess'
import PrivacyPolicy from '../pages/legal/PrivacyPolicy'
import About from '../pages/company/About'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Public Route Component (redirects to dashboard if already authenticated)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : children
}

// Simple page wrapper for footer links
const SimplePage = ({ title, children }) => {
  const { isDark } = useTheme()
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <Navbar />
      <div className={`flex-1 py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${
            isDark
              ? 'bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-slate-900 via-indigo-600 to-violet-600 bg-clip-text text-transparent'
          }`}>
            {title}
          </h1>
          <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
            isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
          }`}>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          {/* OAuth redirects land here with ?token=... and LoginSuccess processes it */}
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={
            <SimplePage title="Terms of Service">
              <p className="text-gray-700">Terms of Service content will be added here.</p>
            </SimplePage>
          } />
          <Route path="/cookies" element={
            <SimplePage title="Cookie Policy">
              <p className="text-gray-700">Cookie Policy content will be added here.</p>
            </SimplePage>
          } />
          <Route path="/acceptable-use" element={
            <SimplePage title="Acceptable Use Policy">
              <p className="text-gray-700">Acceptable Use Policy content will be added here.</p>
            </SimplePage>
          } />
          <Route path="/conduct" element={
            <SimplePage title="Code of Conduct">
              <p className="text-gray-700">Code of Conduct content will be added here.</p>
            </SimplePage>
          } />
          <Route path="/transparency" element={
            <SimplePage title="Transparency Report">
              <p className="text-gray-700">Transparency Report content will be added here.</p>
            </SimplePage>
          } />
          
          {/* Company Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={
            <SimplePage title="Careers">
              <p className="text-gray-700">Join our team! Career opportunities will be listed here.</p>
            </SimplePage>
          } />
          <Route path="/inclusion" element={
            <SimplePage title="Inclusion at MiniLink">
              <p className="text-gray-700">Our commitment to diversity and inclusion.</p>
            </SimplePage>
          } />
          <Route path="/partners" element={
            <SimplePage title="Partners">
              <p className="text-gray-700">Partner with us to grow your business.</p>
            </SimplePage>
          } />
          <Route path="/press" element={
            <SimplePage title="Press">
              <p className="text-gray-700">Press releases and media resources.</p>
            </SimplePage>
          } />
          <Route path="/contact" element={
            <SimplePage title="Contact Us">
              <p className="text-gray-700">Get in touch with our team.</p>
            </SimplePage>
          } />
          <Route path="/reviews" element={
            <SimplePage title="Reviews">
              <p className="text-gray-700">What our customers say about us.</p>
            </SimplePage>
          } />
          <Route path="/accessibility" element={
            <SimplePage title="Accessibility Statement">
              <p className="text-gray-700">Our commitment to accessibility.</p>
            </SimplePage>
          } />
          <Route path="/accessibility-report" element={
            <SimplePage title="Accessibility Report">
              <p className="text-gray-700">Our accessibility compliance report.</p>
            </SimplePage>
          } />
          
          {/* Product Pages */}
          <Route path="/qr-generator" element={
            <SimplePage title="QR Code Generator">
              <p className="text-gray-700">Generate QR codes for your links and content.</p>
            </SimplePage>
          } />
          <Route path="/barcodes" element={
            <SimplePage title="2D Barcodes">
              <p className="text-gray-700">Create various types of 2D barcodes.</p>
            </SimplePage>
          } />
          <Route path="/analytics" element={
            <SimplePage title="Analytics">
              <p className="text-gray-700">Track and analyze your link performance.</p>
            </SimplePage>
          } />
          <Route path="/pages" element={
            <SimplePage title="Pages">
              <p className="text-gray-700">Create custom landing pages for your links.</p>
            </SimplePage>
          } />
          <Route path="/pricing" element={
            <SimplePage title="Pricing">
              <p className="text-gray-700">Choose the perfect plan for your needs.</p>
            </SimplePage>
          } />
          <Route path="/api-docs" element={
            <SimplePage title="API Documentation">
              <p className="text-gray-700">Integrate MiniLink with your applications.</p>
            </SimplePage>
          } />
          <Route path="/enterprise" element={
            <SimplePage title="Enterprise">
              <p className="text-gray-700">Enterprise-grade solutions for large organizations.</p>
            </SimplePage>
          } />
          
          {/* Resource Pages */}
          <Route path="/blog" element={
            <SimplePage title="Blog">
              <p className="text-gray-700">Latest news and insights from MiniLink.</p>
            </SimplePage>
          } />
          <Route path="/guides" element={
            <SimplePage title="Guides & eBooks">
              <p className="text-gray-700">Learn how to get the most out of MiniLink.</p>
            </SimplePage>
          } />
          <Route path="/help" element={
            <SimplePage title="Help Center">
              <p className="text-gray-700">Find answers to common questions.</p>
            </SimplePage>
          } />
          <Route path="/developers" element={
            <SimplePage title="Developers">
              <p className="text-gray-700">Resources for developers using our API.</p>
            </SimplePage>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                <a 
                  href="/"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default AppRoutes


