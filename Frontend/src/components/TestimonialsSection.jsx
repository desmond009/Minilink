import React, { useState, useEffect } from 'react'

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
      avatar: "bg-orange-200"
    },
    {
      id: 2,
      quote: "MiniLink has transformed how we handle our digital marketing campaigns. The analytics are incredible and the QR code generation is seamless. Our conversion rates have increased by 40% since switching.",
      author: "David Chen",
      position: "Digital Marketing Manager at TechFlow",
      initials: "DC",
      avatar: "bg-blue-200"
    },
    {
      id: 3,
      quote: "The URL shortening feature alone has saved us hours of work. But the real game-changer is the detailed analytics that help us understand our audience better. Highly recommended!",
      author: "Sarah Johnson",
      position: "Growth Manager at StartupXYZ",
      initials: "SJ",
      avatar: "bg-purple-200"
    },
    {
      id: 4,
      quote: "We've tried many URL shorteners, but MiniLink stands out with its professional interface and powerful features. The team support is exceptional and the platform is incredibly reliable.",
      author: "Michael Rodriguez",
      position: "CTO at InnovateCorp",
      initials: "MR",
      avatar: "bg-green-200"
    },
    {
      id: 5,
      quote: "The landing page builder is intuitive and the integration with our existing tools was effortless. MiniLink has become an essential part of our marketing toolkit.",
      author: "Emily Watson",
      position: "Product Manager at CreativeStudio",
      initials: "EW",
      avatar: "bg-pink-200"
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
    <section className="bg-gradient-to-br from-orange-500 to-red-500 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-white rounded-full animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in">
            What our customers are saying
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust MiniLink for their digital marketing needs
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Testimonial Card */}
          <div className={`transition-all duration-300 ease-in-out transform ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative">
                <div className="flex items-start">
                  <div className="text-orange-400 text-6xl font-bold mr-6 animate-bounce">"</div>
                  <div className="flex-1">
                    <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                      {testimonials[currentIndex].quote}
                    </blockquote>
                    
                    <div className="flex items-center">
                      <div className={`w-16 h-16 ${testimonials[currentIndex].avatar} rounded-full flex items-center justify-center mr-6 shadow-lg`}>
                        <span className="text-gray-700 font-bold text-xl">{testimonials[currentIndex].initials}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].author}</div>
                        <div className="text-gray-600">{testimonials[currentIndex].position}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-12 space-x-6">
            {/* Previous Button */}
            <button 
              onClick={prevTestimonial}
              className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={nextTestimonial}
              className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Testimonial Counter */}
          <div className="text-center mt-6">
            <span className="text-white/80 text-sm">
              {currentIndex + 1} of {testimonials.length}
            </span>
          </div>
        </div>

        {/* Additional Testimonial Cards (Smaller) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 cursor-pointer ${
                index === currentIndex ? 'ring-2 ring-white/50' : ''
              }`}
              onClick={() => goToTestimonial(index)}
            >
              <div className="text-white/90 text-sm mb-4 line-clamp-3">
                "{testimonial.quote.substring(0, 120)}..."
              </div>
              <div className="flex items-center">
                <div className={`w-10 h-10 ${testimonial.avatar} rounded-full flex items-center justify-center mr-3`}>
                  <span className="text-gray-700 font-semibold text-sm">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-white/70 text-xs">{testimonial.position}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
