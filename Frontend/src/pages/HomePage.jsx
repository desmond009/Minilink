import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UrlForm from '../components/UrlForm'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import FeaturesSection from '../components/FeaturesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import BusinessUseCases from '../components/BusinessUseCases'
import FloatingCTA from '../components/FloatingCTA'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* URL Shortener Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shorten your links instantly
            </h2>
            <p className="text-lg text-gray-600">
              Create short, memorable links that drive engagement
            </p>
          </div>
          <UrlForm />
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Business Use Cases */}
      <BusinessUseCases />

      {/* Floating CTA */}
      <FloatingCTA />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default HomePage
