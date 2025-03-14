'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { 
  DocumentTextIcon, 
  BuildingStorefrontIcon, 
  QrCodeIcon, 
  ArrowPathIcon,
  DocumentPlusIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalEstablishments: 0,
    activeMenus: 0,
    qrScans: 0
  })

  // Simulating data fetch - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/dashboard/stats')
        // const data = await response.json()
        
        // Simulated data
        const data = {
          totalMenus: 2,
          totalEstablishments: 1,
          activeMenus: 1,
          qrScans: 54
        }
        
        setStats(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const recentActivity = [
    { id: 1, type: 'menu_updated', name: 'Main Menu', establishment: 'My Restaurant', date: '2 hours ago' },
    { id: 2, type: 'qr_scan', name: 'Brunch Menu', establishment: 'My Restaurant', date: 'Yesterday' },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! This is an overview of your SafeSpoon menus activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Menus</CardTitle>
              <DocumentTextIcon className="size-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalMenus}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/menus" className="text-sm text-teal-800 hover:underline">
                View all menus
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Establishments</CardTitle>
              <BuildingStorefrontIcon className="size-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalEstablishments}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/establishments" className="text-sm text-teal-800 hover:underline">
                Manage establishments
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Menus</CardTitle>
              <DocumentTextIcon className="size-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.activeMenus}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/menus" className="text-sm text-teal-800 hover:underline">
                View active menus
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">QR Code Scans</CardTitle>
              <QrCodeIcon className="size-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.qrScans}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/qrcodes" className="text-sm text-teal-800 hover:underline">
                View QR analytics
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to help you get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="justify-start gap-2" asChild>
                <Link href="/dashboard/menus/new">
                  <DocumentPlusIcon className="size-5" />
                  Create New Menu
                </Link>
              </Button>
              <Button variant="outline" className="justify-start gap-2" asChild>
                <Link href="/dashboard/establishments/new">
                  <BuildingStorefrontIcon className="size-5" />
                  Add Establishment
                </Link>
              </Button>
              <Button variant="outline" className="justify-start gap-2" asChild>
                <Link href="/dashboard/qrcodes/generate">
                  <QrCodeIcon className="size-5" />
                  Generate QR Code
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and menu interactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowPathIcon className="size-4" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex flex-col">
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-sm text-gray-500">
                        {activity.type === 'menu_updated' ? 'Menu updated' : 'QR code scanned'} • {activity.establishment}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{activity.date}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/menus/${activity.id}`}>
                          <ArrowTopRightOnSquareIcon className="size-4" />
                          <span className="sr-only">View details</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">No recent activity found</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}