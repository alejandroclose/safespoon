'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedClientPage({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication is complete (not loading) and...
    if (!isLoading) {
      // User is not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`)
        return
      }

      // If specific roles are required, check if user has one of them
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, allowedRoles])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-teal-800 border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  // If authenticated and authorized, render the children
  if (isAuthenticated && (allowedRoles.length === 0 || allowedRoles.includes(user.role))) {
    return children
  }

  // Render empty div while redirecting
  return <div></div>
}