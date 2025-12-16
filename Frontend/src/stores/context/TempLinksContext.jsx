import React, { createContext, useContext, useState, useEffect } from 'react'

const TempLinksContext = createContext()

export const useTempLinks = () => {
  const context = useContext(TempLinksContext)
  if (!context) {
    throw new Error('useTempLinks must be used within a TempLinksProvider')
  }
  return context
}

export const TempLinksProvider = ({ children }) => {
  const [tempLinks, setTempLinks] = useState([])
  const MAX_TEMP_LINKS = 3

  // Load temp links from localStorage on mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('tempLinks')
    if (savedLinks) {
      try {
        setTempLinks(JSON.parse(savedLinks))
      } catch (error) {
        console.error('Error loading temp links:', error)
        localStorage.removeItem('tempLinks')
      }
    }
  }, [])

  // Save temp links to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tempLinks', JSON.stringify(tempLinks))
  }, [tempLinks])

  const addTempLink = (originalUrl, shortUrl, shortId) => {
    const newLink = {
      id: Date.now(),
      originalUrl,
      shortUrl,
      shortId,
      createdAt: new Date().toISOString(),
      clickCount: 0
    }

    setTempLinks(prev => {
      const updated = [...prev, newLink]
      // Keep only the last MAX_TEMP_LINKS
      return updated.slice(-MAX_TEMP_LINKS)
    })

    return newLink
  }

  const removeTempLink = (id) => {
    setTempLinks(prev => prev.filter(link => link.id !== id))
  }

  const clearTempLinks = () => {
    setTempLinks([])
    localStorage.removeItem('tempLinks')
  }

  const canCreateTempLink = () => {
    return tempLinks.length < MAX_TEMP_LINKS
  }

  const getRemainingLinks = () => {
    return Math.max(0, MAX_TEMP_LINKS - tempLinks.length)
  }

  const value = {
    tempLinks,
    addTempLink,
    removeTempLink,
    clearTempLinks,
    canCreateTempLink,
    getRemainingLinks,
    MAX_TEMP_LINKS
  }

  return (
    <TempLinksContext.Provider value={value}>
      {children}
    </TempLinksContext.Provider>
  )
}
