'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import EstablishmentForm from '@/components/establishments/EstablishmentForm'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function EditEstablishmentPage() {
  const { id } = useParams()
  const [establishment, setEstablishment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEstablishment = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/establishments/${id}`)
        // const data = await response.json()
        
        // Simulated data
        const data = {
          id: id,
          name: 'The Green Bistro',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '90210',
          phone: '(555) 123-4567',
          email: 'contact@greenbistro.com',
          website: 'https://greenbistro.com'
        }
        
        setEstablishment(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching establishment:', error)
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

  return <EstablishmentForm initialValues={establishment} isEdit={true} />
}