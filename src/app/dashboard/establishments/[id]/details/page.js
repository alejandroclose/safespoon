// app/dashboard/establishments/[id]/page.js
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import EstablishmentForm from '@/components/establishments/EstablishmentForm'
import GooglePlacesScript from '@/components/establishments/GooglePlacesScript'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { ArrowLeftIcon, ArrowPathIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircleIcon } from '@heroicons/react/24/outline'
import ClientOnly from '@/components/establishments/ClientOnly'

export default function EditEstablishmentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [establishment, setEstablishment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEstablishment = async () => {
      try {
        // Simulated data for now
        // In production, you would fetch from your API
        const mockEstablishment = {
          id: id,
          name: 'The Green Bistro',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          country: 'United States',
          phone: '(555) 123-4567',
          email: 'contact@greenbistro.com',
          website: 'https://www.greenbistro.com',
          description: 'A cozy bistro serving organic and locally sourced food.',
          isActive: true
        }
        
        setEstablishment(mockEstablishment)
        setIsLoading(false)
        
        // Uncomment for real API use
        /*
        const response = await fetch(`/api/establishments/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch establishment')
        }
        
        const data = await response.json()
        setEstablishment(data)
        setIsLoading(false)
        */
      } catch (error) {
        console.error('Error fetching establishment:', error)
        setError('Failed to load establishment details. Please try again.')
        setIsLoading(false)
      }
    }
    
    fetchEstablishment()
  }, [id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ArrowPathIcon className="size-8 animate-spin text-teal-700 mx-auto mb-4" />
            <p className="text-gray-500">Loading establishment...</p>
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

  return (
    <DashboardLayout>
      <ClientOnly>
        <GooglePlacesScript />
      </ClientOnly>
      <div className="flex flex-col gap-6">
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
            <h1 className="text-2xl font-bold tracking-tight">Edit Establishment</h1>
            <p className="text-gray-500">
              Update the details for {establishment?.name}
            </p>
          </div>
        </div>
        
        <ClientOnly>
          <EstablishmentForm establishment={establishment} />
        </ClientOnly>
      </div>
    </DashboardLayout>
  )
}