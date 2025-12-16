import React from 'react'
import { motion } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/layout/Navbar'
import UrlForm from '../components/features/UrlForm'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import { useTheme } from '../context/ThemeContext'

const Home = () => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Input Form */}
      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* Main URL Form */}
        <UrlForm />

        {/* Social Proof Section */}
        <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          isDark ? 'bg-slate-800/50' : 'bg-slate-50'
        }`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark
                  ? 'bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-slate-900 via-indigo-600 to-violet-600 bg-clip-text text-transparent'
              }`}>
                Why MiniLink?
              </h2>
              <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Experience the difference with our cutting-edge URL shortening service
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  number: '01',
                  title: 'Lightning Fast',
                  description: 'Shorten URLs in milliseconds with our optimized infrastructure'
                },
                {
                  number: '02',
                  title: 'Powerful Analytics',
                  description: 'Track clicks, referrers, devices and more in real-time'
                },
                {
                  number: '03',
                  title: 'Customizable',
                  description: 'Create custom short links with your own branding'
                },
                {
                  number: '04',
                  title: 'Enterprise Grade',
                  description: 'Bank-level security and 99.9% uptime guarantee'
                },
                {
                  number: '05',
                  title: 'API Ready',
                  description: 'Integrate MiniLink into your applications seamlessly'
                },
                {
                  number: '06',
                  title: 'Always Free',
                  description: 'Start shortening links with no credit card required'
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700/50 hover:border-indigo-500/50'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
                    {feature.number}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark
                  ? 'bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-slate-900 via-indigo-600 to-violet-600 bg-clip-text text-transparent'
              }`}>
                Perfect for Everyone
              </h2>
              <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                From solopreneurs to enterprises, MiniLink scales with you
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '📱',
                  title: 'Social Media',
                  description: 'Share shorter URLs on Twitter, Instagram, and TikTok. Save characters and add more context.'
                },
                {
                  icon: '📧',
                  title: 'Email Marketing',
                  description: 'Track email campaign performance with detailed click analytics and engagement metrics.'
                },
                {
                  icon: '📊',
                  title: 'Business',
                  description: 'Professional link management for marketing teams, agencies, and enterprises.'
                }
              ].map((useCase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-2xl border-2 text-center transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-5xl mb-4">{useCase.icon}</div>
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    {useCase.title}
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {useCase.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          isDark ? 'bg-gradient-to-r from-indigo-900/20 to-violet-900/20' : 'bg-gradient-to-r from-indigo-50 to-violet-50'
        }`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark
                ? 'bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-indigo-600 to-violet-600 bg-clip-text text-transparent'
            }`}>
              Ready to Shorten Your Links?
            </h2>
            <p className={`text-xl mb-8 transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Join thousands of users who are already simplifying their links with MiniLink.
            </p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? 'dark' : 'light'}
      />
    </div>
  )
}

export default Home
