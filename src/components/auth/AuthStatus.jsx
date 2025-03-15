'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  
  if (isLoading) {
    return <div className="animate-pulse h-10 w-24 bg-gray-200 rounded-md"></div>
  }
  
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Sign Out
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">
          Sign In
        </Link>
      </Button>
      <Button size="sm" className="bg-teal-900 hover:bg-teal-800" asChild>
        <Link href="/signup">
          Sign Up
        </Link>
      </Button>
    </div>
  )
}