import React from 'react'

const HeroSection = () => {
  return (
    <section className="bg-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-60 left-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-80 right-1/3 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-32 right-1/2 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-64 left-1/3 w-2 h-2 bg-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build stronger digital connections
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information. Build, edit, and track everything inside the MiniLink Connections Platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Get started for free →
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors">
              Get a quote →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
