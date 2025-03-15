'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user

  const login = async (credentials) => {
    const result = await signIn('credentials', {
      redirect: false,
      ...credentials,
    })
    
    return result
  }

  const logout = async (callbackUrl = '/') => {
    await signOut({ redirect: false })
    router.push(callbackUrl)
  }

  const hasRole = (role) => {
    if (!isAuthenticated || !user) return false
    
    // Allow multiple roles as an array
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    
    return user.role === role
  }

  // Check if user has permission for specific actions
  const can = (action) => {
    if (!isAuthenticated) return false
    
    // Admin can do everything
    if (user.role === 'admin') return true
    
    // Define your permission logic here
    const permissions = {
      'manage:establishments': ['admin', 'establishment_owner'],
      'view:establishments': ['admin', 'establishment_owner', 'establishment_staff'],
      'manage:menus': ['admin', 'establishment_owner', 'establishment_staff'],
      'view:menus': ['admin', 'establishment_owner', 'establishment_staff', 'consumer'],
      // Add more permissions as needed
    }
    
    const allowedRoles = permissions[action] || []
    return allowedRoles.includes(user.role)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    can
  }
}