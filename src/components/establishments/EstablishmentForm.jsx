// src/components/establishments/EstablishmentForm.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline'

// STEP 1: Start with minimal components
export default function EstablishmentForm({ establishment }) {
  const router = useRouter()
  
  return (
    <div className="w-full border rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <BuildingStorefrontIcon className="w-5 h-5 text-teal-700" />
          <h2 className="text-xl font-semibold">
            {establishment ? 'Edit Establishment' : 'New Establishment'}
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {establishment 
            ? 'Update your establishment details' 
            : 'Add a new restaurant or establishment to your account'
          }
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-6 flex border-b">
          <button 
            className="pb-2 px-4 border-b-2 border-teal-700 font-medium text-teal-700"
          >
            Manual Entry
          </button>
          <button 
            className="pb-2 px-4 text-gray-500"
          >
            Google Places Search
          </button>
        </div>
        
        <form className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Establishment Name *
              </label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="The Green Bistro"
              />
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Active Status
                </label>
                <p className="text-sm text-gray-500">
                  Is this establishment currently active?
                </p>
              </div>
              <input type="checkbox" defaultChecked={true} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>
            <textarea 
              className="w-full min-h-24 px-3 py-2 border rounded-md"
              placeholder="A brief description of your establishment"
            />
          </div>
        </form>
      </div>
      
      <div className="flex justify-between p-6 border-t">
        <button
          className="px-4 py-2 border rounded-md"
          onClick={() => router.push('/dashboard/establishments')}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-teal-900 text-white rounded-md"
        >
          {establishment ? 'Update Establishment' : 'Create Establishment'}
        </button>
      </div>
    </div>
  )
}