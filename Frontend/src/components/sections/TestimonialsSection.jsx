import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const testimonials = [
    {
      id: 1,
      quote: "When it came to deciding on a platform to use for generating all of our QR Codes, there was a general consensus among the team—of course we should use MiniLink! We didn't even give it a second thought.",
      author: "Melody Park",
      position: "Marketing Lead at Smalls",
      initials: "MP",
      avatar: "bg-gradient-to-r from-orange-400 to-red-400"
    },
    {
      id: 2,
      quote: "MiniLink has transformed how we handle our digital marketing campaigns. The analytics are incredible and the QR code generation is seamless. Our conversion rates have increased by 40% since switching.",
      author: "David Chen",
      position: "Digital Marketing Manager at TechFlow",
      initials: "DC",
      avatar: "bg-gradient-to-r from-blue-400 to-indigo-500"
    },
    {
      id: 3,
      quote: "The URL shortening feature alone has saved us hours of work. But the real game-changer is the detailed analytics that help us understand our audience better. Highly recommended!",
      author: "Sarah Johnson",
      position: "Growth Manager at StartupXYZ",
      initials: "SJ",
      avatar: "bg-gradient-to-r from-purple-400 to-pink-500"
    },
    {
      id: 4,
      quote: "We've tried many URL shorteners, but MiniLink stands out with its professional interface and powerful features. The team support is exceptional and the platform is incredibly reliable.",
      author: "Michael Rodriguez",
      position: "CTO at InnovateCorp",
      initials: "MR",
      avatar: "bg-gradient-to-r from-green-400 to-teal-500"
    },
    {
      id: 5,
      quote: "The landing page builder is intuitive and the integration with our existing tools was effortless. MiniLink has become an essential part of our marketing toolkit.",
      author: "Emily Watson",
      position: "Product Manager at CreativeStudio",
      initials: "EW",
      avatar: "bg-gradient-to-r from-pink-400 to-rose-500"
    }
  ]

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const goToTestimonial = (index) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true)
      setCurrentIndex(index)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-1/4 w-20 h-20 bg-white rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            What our customers are saying
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust MiniLink for their digital marketing needs
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Main Testimonial Card */}
          <motion.div 
            className="relative"
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden border border-white/20">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative">
                <div className="flex items-start">
                  <motion.div 
                    className="text-orange-400 text-6xl font-bold mr-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    "
                  </motion.div>
                  <div className="flex-1">
                    <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                      {testimonials[currentIndex].quote}
                    </blockquote>
                    
                    <div className="flex items-center">
                      <motion.div 
                        className={`w-16 h-16 ${testimonials[currentIndex].avatar} rounded-full flex items-center justify-center mr-6 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <span className="text-white font-bold text-xl">{testimonials[currentIndex].initials}</span>
                      </motion.div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].author}</div>
                        <div className="text-gray-600">{testimonials[currentIndex].position}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <motion.div 
            className="flex justify-center items-center mt-12 space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Previous Button */}
            <motion.button 
              onClick={prevTestimonial}
              className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button 
              onClick={nextTestimonial}
              className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Testimonial Counter */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-white/80 text-sm">
              {currentIndex + 1} of {testimonials.length}
            </span>
          </motion.div>
        </div>

        {/* Additional Testimonial Cards (Smaller) */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 cursor-pointer ${
                index === currentIndex ? 'ring-2 ring-white/50' : ''
              }`}
              onClick={() => goToTestimonial(index)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-white/90 text-sm mb-4 line-clamp-3">
                "{testimonial.quote.substring(0, 120)}..."
              </div>
              <div className="flex items-center">
                <div className={`w-10 h-10 ${testimonial.avatar} rounded-full flex items-center justify-center mr-3`}>
                  <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-white/70 text-xs">{testimonial.position}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection
