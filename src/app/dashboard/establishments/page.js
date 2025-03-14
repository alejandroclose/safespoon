'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  EllipsisHorizontalIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'

export default function EstablishmentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [establishments, setEstablishments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [establishmentToDelete, setEstablishmentToDelete] = useState(null)

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/establishments')
        // const data = await response.json()
        
        // Simulated data
        const data = [
          {
            id: 'est1',
            name: 'The Green Bistro',
            address: '123 Main St, Anytown, CA 90210',
            phone: '(555) 123-4567',
            email: 'contact@greenbistro.com',
            owners: [
              { id: 'user1', name: 'Jane Smith' }
            ],
            activeMenus: 2
          },
          {
            id: 'est2',
            name: 'Oceanside Restaurant',
            address: '456 Beach Dr, Seaside, FL 33139',
            phone: '(555) 987-6543',
            email: 'info@oceanside.com',
            owners: [
              { id: 'user1', name: 'Jane Smith' }
            ],
            activeMenus: 1
          }
        ]
        
        setEstablishments(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching establishments:', error)
        setIsLoading(false)
      }
    }
    
    fetchEstablishments()
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredEstablishments = establishments.filter(est => 
    est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    est.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmDelete = (establishment) => {
    setEstablishmentToDelete(establishment)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    try {
      // Replace with actual API call
      // await fetch(`/api/establishments/${establishmentToDelete.id}`, {
      //   method: 'DELETE'
      // })
      
      // Update local state
      setEstablishments(prev => 
        prev.filter(est => est.id !== establishmentToDelete.id)
      )
      
      setDeleteDialogOpen(false)
      setEstablishmentToDelete(null)
    } catch (error) {
      console.error('Error deleting establishment:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Establishments</h1>
            <p className="text-gray-500">
              Manage your restaurant locations and branches
            </p>
          </div>
          <Button asChild className="bg-teal-900 hover:bg-teal-700">
            <Link href="/dashboard/establishments/new">
              <PlusIcon className="size-4 mr-1" />
              Add Establishment
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Input
              type="search"
              placeholder="Search establishments..."
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
              <p className="text-gray-500">Loading establishments...</p>
            </div>
          </div>
        ) : filteredEstablishments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEstablishments.map((establishment) => (
              <Card key={establishment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BuildingStorefrontIcon className="size-5 text-teal-700" />
                      {establishment.name}
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
                          <Link href={`/dashboard/establishments/${establishment.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/establishments/${establishment.id}/edit`}>
                            Edit Establishment
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/establishments/${establishment.id}/staff`}>
                            Manage Staff
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => confirmDelete(establishment)}
                        >
                          Delete Establishment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    <Badge variant="outline" className="bg-teal-50">
                      {establishment.activeMenus} active {establishment.activeMenus === 1 ? 'menu' : 'menus'}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-500 pb-1">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="size-4 shrink-0 mt-0.5" />
                    <span>{establishment.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="size-4 shrink-0" />
                    <span>{establishment.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="size-4 shrink-0" />
                    <span>{establishment.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4 shrink-0" />
                    <span>{establishment.owners.map(owner => owner.name).join(', ')}</span>
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
                      <Link href={`/dashboard/establishments/${establishment.id}`}>
                        Details
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/dashboard/establishments/${establishment.id}/menus`}>
                        Menus
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md bg-gray-50">
            <BuildingStorefrontIcon className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No establishments found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : "You haven't added any establishments yet"}
            </p>
            <Button asChild className="bg-teal-900 hover:bg-teal-700">
              <Link href="/dashboard/establishments/new">
                <PlusIcon className="size-4 mr-1" />
                Add Your First Establishment
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Establishment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {establishmentToDelete?.name}? 
              This action cannot be undone, and all associated menus will be unlinked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}