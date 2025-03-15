'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Create a context to provide database access
const DbContext = createContext(null)

export function DbProvider({ children }) {
  const [isClient, setIsClient] = useState(false)

  // Initialize the database when the component mounts, but only in server contexts
  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true)
    
    // We don't need to initialize the database on the client side
    // The database operations should only happen in Server Components or API Routes
    // This component is just a placeholder for potential future client-side database needs
  }, [])

  return <DbContext.Provider value={{ isClient }}>{children}</DbContext.Provider>
}

export function useDb() {
  const context = useContext(DbContext)
  if (!context) {
    throw new Error('useDb must be used within a DbProvider')
  }
  return context
}