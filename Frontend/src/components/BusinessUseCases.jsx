import React from 'react'

const BusinessUseCases = () => {
  const useCases = [
    {
      category: "RETAIL",
      title: "Attract customers and keep loyal shoppers coming back",
      description: "Manage and track in-person and online customer connections with powerful analytics and engagement tools.",
      illustration: (
        <div className="bg-blue-100 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <div className="font-medium">Join MyKicks Rewards!</div>
            <div className="text-xs">Scan the code or follow the link to register now</div>
            <div className="font-mono text-xs mt-1">@yourbrnd.co/join</div>
          </div>
        </div>
      )
    },
    {
      category: "CONSUMER PACKAGED GOODS",
      title: "Thriving brands start with raving fans and powerful connections",
      description: "Empower consumers to learn about products and interact with brands through seamless digital experiences.",
      illustration: (
        <div className="bg-green-100 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-green-800">
            <div className="font-medium">Product Review</div>
            <div className="text-xs">Betty Baker</div>
            <div className="flex justify-center mt-1">
              {[...Array(4)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      )
    },
    {
      category: "HOSPITALITY",
      title: "Delight your guests with seamless digital experiences",
      description: "Create memorable guest experiences with easy-to-use digital tools and personalized engagement.",
      illustration: (
        <div className="bg-purple-100 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="text-sm text-purple-800">
            <div className="font-medium">Guest Services</div>
            <div className="text-xs">Easy check-in and amenities</div>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            See how other businesses use MiniLink
          </h2>
          <div className="flex space-x-2">
            <button className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {useCase.category}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {useCase.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {useCase.description}
              </p>
              
              <div className="mb-6">
                {useCase.illustration}
              </div>
              
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Read More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BusinessUseCases
