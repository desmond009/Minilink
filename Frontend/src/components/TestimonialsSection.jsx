import React from 'react'

const TestimonialsSection = () => {
  return (
    <section className="bg-orange-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            What our customers are saying
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="flex items-start">
              <div className="text-orange-400 text-6xl font-bold mr-4">"</div>
              <div className="flex-1">
                <blockquote className="text-xl text-gray-700 leading-relaxed mb-6">
                  When it came to deciding on a platform to use for generating all of our QR Codes, there was a general consensus among the team—of course we should use MiniLink! We didn't even give it a second thought.
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-semibold text-lg">MP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Melody Park</div>
                    <div className="text-gray-600">Marketing Lead at Smalls</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center mt-8 space-x-4">
            <button className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
