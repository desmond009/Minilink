import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [hoveredLink, setHoveredLink] = useState(null)

  const footerSections = [
    {
      title: "Why MiniLink?",
      links: [
        { name: "Integrations & API", href: "/api-docs" },
        { name: "Enterprise Class", href: "/enterprise" },
        { name: "Pricing", href: "/pricing" }
      ]
    },
    {
      title: "Products",
      links: [
        { name: "URL Shortener", href: "/" },
        { name: "QR Code Generator", href: "/qr-generator" },
        { name: "2D Barcodes", href: "/barcodes" },
        { name: "Analytics", href: "/analytics" },
        { name: "Pages", href: "/pages" }
      ],
      subSection: {
        title: "Features",
        links: [
          { name: "Link-in-bio", href: "/link-in-bio" },
          { name: "Branded Links", href: "/branded-links" },
          { name: "Mobile Links", href: "/mobile-links" },
          { name: "UTM Campaigns", href: "/utm-campaigns" },
          { name: "Digital Business Cards", href: "/business-cards" }
        ]
      }
    },
    {
      title: "Solutions",
      links: [
        { name: "Retail", href: "/solutions/retail" },
        { name: "Consumer Packaged Goods", href: "/solutions/cpg" },
        { name: "Hospitality", href: "/solutions/hospitality" },
        { name: "Media & Entertainment", href: "/solutions/media" },
        { name: "Tech Software & Hardware", href: "/solutions/tech" },
        { name: "Healthcare", href: "/solutions/healthcare" },
        { name: "Insurance", href: "/solutions/insurance" },
        { name: "Financial Services", href: "/solutions/finance" },
        { name: "Professional Services", href: "/solutions/professional" },
        { name: "Education", href: "/solutions/education" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Guides & eBooks", href: "/guides" },
        { name: "Videos & Webinars", href: "/videos" },
        { name: "Customer Stories", href: "/stories" },
        { name: "QR Code Inspiration Gallery", href: "/gallery" },
        { name: "Developers", href: "/developers" },
        { name: "Apps and Integrations", href: "/integrations" },
        { name: "Help Center", href: "/help" },
        { name: "Trust Center", href: "/trust" },
        { name: "Security Center", href: "/security" },
        { name: "Browser Extension", href: "/extension" },
        { name: "Mobile App", href: "/mobile-app" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Acceptable Use Policy", href: "/acceptable-use" },
        { name: "Code of Conduct", href: "/conduct" },
        { name: "Transparency Report", href: "/transparency" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About MiniLink", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Inclusion at MiniLink", href: "/inclusion" },
        { name: "Partners", href: "/partners" },
        { name: "Press", href: "/press" },
        { name: "Contact", href: "/contact" },
        { name: "Reviews", href: "/reviews" },
        { name: "Accessibility Report", href: "/accessibility-report" },
        { name: "Accessibility Statement", href: "/accessibility", underline: true }
      ]
    }
  ]

  const handleLinkClick = (href) => {
    if (href.startsWith('/')) {
      navigate(href)
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 border-2 border-orange-400 rounded-lg"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-16 h-16 bg-orange-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-blue-400 transform rotate-45"
          animate={{
            rotate: [45, 405],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-1/3 w-8 h-8 bg-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-orange-400 font-bold text-lg mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <motion.button
                        onClick={() => handleLinkClick(link.href)}
                        className={`text-white/80 hover:text-orange-400 transition-colors duration-200 text-sm ${
                          link.underline ? 'underline' : ''
                        }`}
                        whileHover={{ x: 5 }}
                        onHoverStart={() => setHoveredLink(link.name)}
                        onHoverEnd={() => setHoveredLink(null)}
                      >
                        {link.name}
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
                
                {/* Sub-section for Products */}
                {section.subSection && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-orange-400 font-semibold text-sm mb-3">
                      {section.subSection.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.subSection.links.map((link, linkIndex) => (
                        <motion.li
                          key={link.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05) + 0.3, duration: 0.4 }}
                          viewport={{ once: true }}
                        >
                          <motion.button
                            onClick={() => handleLinkClick(link.href)}
                            className="text-white/70 hover:text-orange-400 transition-colors duration-200 text-xs"
                            whileHover={{ x: 5 }}
                          >
                            {link.name}
                          </motion.button>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              {/* Logo and Copyright */}
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.button
                  onClick={scrollToTop}
                  className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  MiniLink
                </motion.button>
                <span className="text-white/60 text-sm">
                  © 2025 MiniLink | Handmade in New York City, Denver, Berlin, and all over the world.
                </span>
              </motion.div>

              {/* Social Media Icons */}
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.721v1.5h8.558v-1.5zm-5.03 5.03c0 1.297-1.05 2.347-2.347 2.347s-2.347-1.05-2.347-2.347 1.05-2.347 2.347-2.347 2.347 1.05 2.347 2.347z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
              </motion.div>

              {/* Compliance Badges */}
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="bg-blue-600 px-3 py-2 rounded text-xs font-semibold flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>GDPR COMPLIANT</span>
                </motion.div>
                <motion.div
                  className="bg-blue-600 px-3 py-2 rounded text-xs font-semibold flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>CCPA</span>
                </motion.div>
                <motion.div
                  className="bg-blue-600 px-3 py-2 rounded text-xs font-semibold flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>SOC 2</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Widget */}
      <motion.div
        className="fixed bottom-4 left-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.a
          href="/accessibility"
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </motion.a>
        <div className="absolute bottom-14 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200">
          Accessibility Statement
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
