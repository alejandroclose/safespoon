// app/dashboard/establishments/new/page.js
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EstablishmentForm from '@/components/establishments/EstablishmentForm'
import GooglePlacesScript from '@/components/establishments/GooglePlacesScript'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import ClientOnly from '@/components/establishments/ClientOnly'

export default function NewEstablishmentPage() {
  const router = useRouter()

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
            <h1 className="text-2xl font-bold tracking-tight">New Establishment</h1>
            <p className="text-gray-500">
              Add a new restaurant or establishment to your account
            </p>
          </div>
        </div>
        
        <ClientOnly>
          <EstablishmentForm />
        </ClientOnly>
      </div>
    </DashboardLayout>
  )
}