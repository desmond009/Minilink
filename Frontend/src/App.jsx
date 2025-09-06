import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TempLinksProvider } from './context/TempLinksContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import About from './pages/company/About'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
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
const PublicRoute = ({ children }) => {
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
const SimplePage = ({ title, children }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  </div>
)

const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
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
        </Routes>
      </div>
    </Router>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TempLinksProvider>
          <AppContent />
        </TempLinksProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
