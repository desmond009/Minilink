import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ]
    }
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@minilink.com', label: 'Email' },
  ]

  return (
    <footer className={`relative transition-colors duration-300 ${
      isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-slate-50 border-t border-slate-200'
    }`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="flex items-center mb-4 group">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                MiniLink
              </div>
            </Link>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Create short, memorable links that drive engagement and track performance.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isDark
                        ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200'
                    }`}
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIdx) => (
            <motion.div
              key={sectionIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className={`font-bold text-lg mb-6 transition-colors duration-300 ${
                isDark ? 'text-slate-200' : 'text-slate-900'
              }`}>
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.href}
                      className={`text-sm transition-all duration-300 inline-flex items-center group ${
                        isDark
                          ? 'text-slate-400 hover:text-indigo-400'
                          : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      {link.label}
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className={`border-t transition-colors duration-300 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        } my-8`} />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            © {currentYear} MiniLink. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Made with
            </span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={16} className="text-red-500" />
            </motion.span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              by the MiniLink team
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
