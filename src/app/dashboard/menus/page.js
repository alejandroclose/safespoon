'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  XCircleIcon,
  QrCodeIcon,
  ArrowTopRightOnSquareIcon,
  EllipsisHorizontalIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function MenusPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [menus, setMenus] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/menus')
        // const data = await response.json()
        
        // Simulated data
        const data = [
          {
            id: 'menu1',
            name: 'Main Dinner Menu',
            description: 'Our regular dinner menu with allergen information',
            isActive: true,
            lastUpdated: '2025-02-15T14:30:00Z',
            establishments: [
              { id: 'est1', name: 'The Green Bistro' }
            ],
            categoryCount: 4,
            itemCount: 22
          },
          {
            id: 'menu2',
            name: 'Brunch Menu',
            description: 'Weekend brunch options',
            isActive: true,
            lastUpdated: '2025-02-10T09:15:00Z',
            establishments: [
              { id: 'est1', name: 'The Green Bistro' }
            ],
            categoryCount: 3,
            itemCount: 15
          },
          {
            id: 'menu3',
            name: 'Kids Menu',
            description: 'Options for children',
            isActive: false,
            lastUpdated: '2025-01-20T11:45:00Z',
            establishments: [
              { id: 'est1', name: 'The Green Bistro' }
            ],
            categoryCount: 2,
            itemCount: 8
          }
        ]
        
        setMenus(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching menus:', error)
        setIsLoading(false)
      }
    }
    
    fetchMenus()
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menu.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Menus</h1>
            <p className="text-gray-500">
              Create and manage your allergen-aware menus
            </p>
          </div>
          <Button asChild className="bg-teal-900 hover:bg-teal-700">
            <Link href="/dashboard/menus/new">
              <PlusIcon className="size-4 mr-1" />
              Create New Menu
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Input
              type="search"
              placeholder="Search menus..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <Button variant="outline" size="sm" className="flex gap-1 self-end">
            <ArrowPathIcon className="size-4" />
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ArrowPathIcon className="size-8 animate-spin text-teal-700 mx-auto mb-4" />
              <p className="text-gray-500">Loading menus...</p>
            </div>
          </div>
        ) : filteredMenus.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMenus.map((menu) => (
              <Card key={menu.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="flex items-center gap-2 mb-1">
                      <DocumentTextIcon className="size-5 text-teal-700" />
                      {menu.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <EllipsisHorizontalIcon className="size-5" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/menus/${menu.id}`}>
                            Edit Menu
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/menus/preview/${menu.id}`}>
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/menus/${menu.id}/qrcode`}>
                            Generate QR Code
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/menus/${menu.id}`, '_blank')}>
                          View Public Menu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <CardDescription className="flex items-center gap-2">
                    {menu.isActive ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircleIcon className="size-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        <XCircleIcon className="size-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      Updated {formatDate(menu.lastUpdated)}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="text-sm text-gray-500 mb-2">{menu.description}</div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-3">
                    <div>
                      <span className="font-medium">{menu.categoryCount}</span> categories
                    </div>
                    <div>
                      <span className="font-medium">{menu.itemCount}</span> items
                    </div>
                    <div>
                      <span className="font-medium">{menu.establishments.length}</span> establishment{menu.establishments.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {menu.establishments.map(est => (
                      <Badge key={est.id} variant="outline" className="text-xs">
                        {est.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/dashboard/menus/${menu.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      asChild
                    >
                      <Link href={`/dashboard/menus/preview/${menu.id}`}>
                        <QrCodeIcon className="size-4" />
                        Preview
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-8 flex-none p-0"
                      onClick={() => window.open(`/menus/${menu.id}`, '_blank')}
                    >
                      <ArrowTopRightOnSquareIcon className="size-4" />
                      <span className="sr-only">Open</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md bg-gray-50">
            <DocumentTextIcon className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No menus found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : "You haven't created any menus yet"}
            </p>
            <Button asChild className="bg-teal-900 hover:bg-teal-700">
              <Link href="/dashboard/menus/new">
                <PlusIcon className="size-4 mr-1" />
                Create Your First Menu
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}