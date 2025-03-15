'use client'

import { createContext, useContext, useEffect } from 'react'
import { initDb } from '@/db/db'

// Create a context to provide database access
const DbContext = createContext(null)

export function DbProvider({ children }) {
  // Initialize the database when the component mounts
  useEffect(() => {
    // We need to initialize the database on the client side
    // This is because the database is not available during SSR
    try {
      initDb(window.ENV || {})
    } catch (error) {
      console.error('Failed to initialize database:', error)
    }
  }, [])

  return <DbContext.Provider value={null}>{children}</DbContext.Provider>
}

export function useDb() {
  return useContext(DbContext)
}