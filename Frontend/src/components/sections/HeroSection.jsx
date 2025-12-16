import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  const { isDark } = useTheme()

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [-50, 50, -50],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [50, -50, 50],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            y: [100, -100, 100],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800/50 border-indigo-500/30 text-indigo-300'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            <Zap size={16} />
            <span className="text-sm font-semibold">Free, Fast & Reliable</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
            isDark
              ? 'bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-slate-900 via-indigo-600 to-violet-600 bg-clip-text text-transparent'
          }`}>
            Shorten Your Links,
            <br />
            <span className="text-4xl md:text-6xl">Expand Your Reach</span>
          </h1>
          <p className={`text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Create short, memorable links in seconds. Track performance, share with confidence, and grow your audience.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Zap,
              title: 'Instant Shortening',
              description: 'Create short links in milliseconds'
            },
            {
              icon: Shield,
              title: 'Secure & Safe',
              description: 'Enterprise-grade security for your links'
            },
            {
              icon: BarChart3,
              title: 'Analytics',
              description: 'Track clicks, referrers, and more'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50'
                    : 'bg-white/50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-slate-200' : 'text-slate-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
