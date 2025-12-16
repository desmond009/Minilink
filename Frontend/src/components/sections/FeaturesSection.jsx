import React from 'react'

const FeaturesSection = () => {
  const features = [
    {
      title: "URL Shortener",
      description: "A comprehensive solution to help make every point of connection between your content and your audience more powerful.",
      icon: (
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      stats: {
        engagements: "564",
        clicks: "1,589",
        locations: [
          { name: "Brooklyn", clicks: "34" },
          { name: "San Francisco", clicks: "18" }
        ]
      }
    },
    {
      title: "QR Codes",
      description: "QR Code solutions for every customer, business and brand experience.",
      icon: (
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
        </svg>
      ),
      features: [
        "Fully customizable QR Codes",
        "Dynamic QR Codes",
        "QR Code types & destination options",
        "Advanced analytics & tracking"
      ]
    },
    {
      title: "Landing Pages",
      description: "MiniLink Pages helps you create engaging, mobile-optimized landing pages in minutes.",
      icon: (
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      preview: "SF Living Shop"
    }
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The MiniLink Connections Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            All the products you need to build brand connections, manage links and QR Codes, and connect with audiences everywhere, in a single unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                {feature.icon}
                <h3 className="text-2xl font-bold text-gray-900 ml-4">{feature.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">{feature.description}</p>

              {feature.stats && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">{feature.stats.engagements} Engagements</span>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  
                  <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg mb-4">
                    <span className="font-medium">yourbrnd.co/app</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-2">Clicks by location</div>
                    {feature.stats.locations.map((location, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{idx + 1} {location.name}</span>
                        <span>{location.clicks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {feature.features && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Popular QR Code Features</h4>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feature.preview && (
                <div className="mb-6">
                  <div className="bg-orange-100 rounded-lg p-4 text-center">
                    <div className="text-orange-800 font-medium">{feature.preview}</div>
                    <div className="text-orange-600 text-sm">Mobile Landing Page Preview</div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Get started for free
                </button>
                <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
