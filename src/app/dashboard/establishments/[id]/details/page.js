// app/dashboard/establishments/[id]/details/page.js
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { 
  ArrowLeftIcon, 
  ArrowPathIcon, 
  PencilIcon, 
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserIcon,
  BuildingStorefrontIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog'

export default function EstablishmentDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [establishment, setEstablishment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    const fetchEstablishment = async () => {
      try {
        const response = await fetch(`/api/establishments/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch establishment')
        }
        
        const data = await response.json()
        setEstablishment(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching establishment:', error)
        setError('Failed to load establishment details. Please try again.')
        setIsLoading(false)
      }
    }
    
    fetchEstablishment()
  }, [id])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/establishments/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete establishment')
      }
      
      router.push('/dashboard/establishments')
      router.refresh()
    } catch (error) {
      console.error('Error deleting establishment:', error)
      setError('Failed to delete establishment. Please try again.')
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ArrowPathIcon className="size-8 animate-spin text-teal-700 mx-auto mb-4" />
            <p className="text-gray-500">Loading establishment details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/dashboard/establishments')}
            className="self-start"
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Back to Establishments
          </Button>
          
          <Alert variant="destructive">
            <XCircleIcon className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  const fullAddress = [
    establishment.address,
    establishment.city,
    establishment.state,
    establishment.postal_code,
    establishment.country
  ].filter(Boolean).join(', ')

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeftIcon className="size-4 mr-1" />
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{establishment.name}</h1>
              <p className="text-gray-500">
                Establishment Details
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 self-end sm:self-auto">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link href={`/dashboard/establishments/${id}/edit`}>
                <PencilIcon className="size-4 mr-1" />
                Edit
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <TrashIcon className="size-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="menus">Menus</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BuildingStorefrontIcon className="size-5 text-teal-700" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1">{establishment.name}</p>
                  </div>
                  
                  {establishment.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{establishment.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      {establishment.is_active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Active Menus</h3>
                    <p className="mt-1">
                      {establishment.activeMenus || 0} {establishment.activeMenus === 1 ? 'menu' : 'menus'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="size-5 text-teal-700" />
                    Contact & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1">{fullAddress}</p>
                    <a 
                      href={googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-teal-600 hover:text-teal-800"
                    >
                      View on Google Maps
                    </a>
                  </div>
                  
                  {establishment.phone && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="mt-1">
                        <a 
                          href={`tel:${establishment.phone}`}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          {establishment.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  
                  {establishment.email && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1">
                        <a 
                          href={`mailto:${establishment.email}`}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          {establishment.email}
                        </a>
                      </p>
                    </div>
                  )}
                  
                  {establishment.website && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Website</h3>
                      <p className="mt-1">
                        <a 
                          href={establishment.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-800"
                        >
                          {establishment.website}
                        </a>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {establishment.place_id && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GlobeAltIcon className="size-5 text-teal-700" />
                      Google Places Information
                    </CardTitle>
                    <CardDescription>
                      This establishment is linked to Google Places
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Place ID</h3>
                        <p className="mt-1 font-mono text-sm">{establishment.place_id}</p>
                      </div>
                      
                      {establishment.google_place_updated_at && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                          <p className="mt-1">
                            {new Date(establishment.google_place_updated_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a 
                        href={`https://www.google.com/maps/place/?q=place_id:${establishment.place_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Google Maps
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="staff" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-5 text-teal-700" />
                    Staff Members
                  </div>
                  <Button 
                    size="sm"
                    asChild
                    className="bg-teal-900 hover:bg-teal-700"
                  >
                    <Link href={`/dashboard/establishments/${id}/staff/invite`}>
                      Add Staff Member
                    </Link>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage who has access to this establishment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {establishment.users && establishment.users.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {establishment.users.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant="outline">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <UserIcon className="size-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No staff members added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="menus" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCodeIcon className="size-5 text-teal-700" />
                    Menus
                  </div>
                  <Button 
                    size="sm"
                    asChild
                    className="bg-teal-900 hover:bg-teal-700"
                  >
                    <Link href={`/dashboard/menus/new?establishment=${id}`}>
                      Create New Menu
                    </Link>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage menus for this establishment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {establishment.activeMenus > 0 ? (
                  <div className="text-center py-4">
                    <p>
                      This section will display the {establishment.activeMenus} active 
                      {establishment.activeMenus === 1 ? ' menu' : ' menus'}.
                    </p>
                    <Button 
                      variant="outline"
                      className="mt-4"
                      asChild
                    >
                      <Link href={`/dashboard/establishments/${id}/menus`}>
                        View All Menus
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <QrCodeIcon className="size-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No menus created yet</p>
                    <Button 
                      className="mt-4 bg-teal-900 hover:bg-teal-700"
                      asChild
                    >
                      <Link href={`/dashboard/menus/new?establishment=${id}`}>
                        Create Your First Menu
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Establishment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {establishment.name}? 
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