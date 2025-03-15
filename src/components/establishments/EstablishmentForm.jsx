// src/components/establishments/EstablishmentForm.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import { nanoid } from 'nanoid'

export default function EstablishmentForm({ establishment }) {
  const router = useRouter()
  const [view, setView] = useState('google') // Default to Google Places view
  const [placeData, setPlaceData] = useState(null)
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: establishment?.name || '',
    address: establishment?.address || '',
    city: establishment?.city || '',
    state: establishment?.state || '',
    zipCode: establishment?.postal_code || '',
    country: establishment?.country || '',
    phone: establishment?.phone || '',
    internationalPhone: establishment?.international_phone || '',
    email: establishment?.email || '',
    website: establishment?.website || '',
    description: establishment?.description || '',
    placeId: establishment?.place_id || '',
    businessStatus: establishment?.business_status || '',
    formattedAddress: establishment?.formatted_address || '',
    vicinity: establishment?.vicinity || '',
    utcOffset: establishment?.utc_offset || '',
    wheelchairAccessible: establishment?.wheelchair_accessible || false,
    priceLevel: establishment?.price_level || '',
    rating: establishment?.rating || '',
    userRatingsTotal: establishment?.user_ratings_total || '',
    openingHours: establishment?.opening_hours || '',
    curbsidePickup: establishment?.curbside_pickup || false,
    delivery: establishment?.delivery || false,
    dineIn: establishment?.dine_in || false,
    reservable: establishment?.reservable || false,
    takeout: establishment?.takeout || false,
    servesBeer: establishment?.serves_beer || false,
    servesWine: establishment?.serves_wine || false,
    servesBreakfast: establishment?.serves_breakfast || false,
    servesBrunch: establishment?.serves_brunch || false,
    servesLunch: establishment?.serves_lunch || false, 
    servesDinner: establishment?.serves_dinner || false,
    servesVegetarian: establishment?.serves_vegetarian || false,
    latitude: establishment?.latitude || '',
    longitude: establishment?.longitude || '',
    isActive: establishment?.is_active !== 0 // SQLite uses 0/1 for booleans
  })
  
  const autoCompleteRef = useRef(null)
  const inputRef = useRef(null)
  
  // Effect to check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (typeof window !== 'undefined' && 
          window.google && 
          window.google.maps && 
          window.google.maps.places) {
        clearInterval(interval)
        setGoogleLoaded(true)
      }
    }
    
    // Poll for Google Maps API availability
    const interval = setInterval(checkGoogleMapsLoaded, 500)
    return () => clearInterval(interval)
  }, [])
  
  // Initialize Google Places Autocomplete once Google is loaded
  useEffect(() => {
    if (googleLoaded && inputRef.current) {
      try {
        console.log("Google Maps API loaded, initializing autocomplete")
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ['establishment'] }
        )
        
        autoCompleteRef.current.addListener('place_changed', () => {
          const place = autoCompleteRef.current.getPlace()
          if (!place.geometry) {
            console.error("No details available for input: '" + place.name + "'")
            return
          }
          
          // Extract place data
          const newPlaceData = {
            name: place.name || '',
            formattedAddress: place.formatted_address || '',
            vicinity: place.vicinity || '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phone: place.formatted_phone_number || '',
            internationalPhone: place.international_phone_number || '',
            website: place.website || '',
            placeId: place.place_id || '',
            businessStatus: place.business_status || '',
            utcOffset: place.utc_offset_minutes?.toString() || '',
            wheelchairAccessible: place.wheelchair_accessible_entrance || false,
            priceLevel: place.price_level?.toString() || '',
            rating: place.rating?.toString() || '',
            userRatingsTotal: place.user_ratings_total?.toString() || '',
            openingHours: place.opening_hours ? JSON.stringify({
                weekday_text: place.opening_hours.weekday_text || [],
                periods: place.opening_hours.periods || [],
                isOpenNow: typeof place.opening_hours.isOpen === 'function' ? place.opening_hours.isOpen() : null
              }) : '',
            curbsidePickup: place.curbside_pickup || false,
            delivery: place.delivery || false,
            dineIn: place.dine_in || false,
            reservable: place.reservable || false,
            takeout: place.takeout || false,
            servesBeer: place.serves_beer || false,
            servesWine: place.serves_wine || false,
            servesBreakfast: place.serves_breakfast || false,
            servesBrunch: place.serves_brunch || false,
            servesLunch: place.serves_lunch || false,
            servesDinner: place.serves_dinner || false,
            servesVegetarian: place.serves_vegetarian_food || false,
            latitude: place.geometry?.location?.lat() || '',
            longitude: place.geometry?.location?.lng() || ''
          }
          
          // Parse address components
          if (place.address_components) {
            let streetNumber = ''
            let route = ''
            
            place.address_components.forEach(component => {
              const types = component.types
              
              if (types.includes('street_number')) {
                streetNumber = component.long_name
              } else if (types.includes('route')) {
                route = component.long_name
              } else if (types.includes('locality')) {
                newPlaceData.city = component.long_name
              } else if (types.includes('administrative_area_level_1')) {
                newPlaceData.state = component.short_name
              } else if (types.includes('postal_code')) {
                newPlaceData.zipCode = component.long_name
              } else if (types.includes('country')) {
                newPlaceData.country = component.long_name
              }
            })
            
            newPlaceData.address = `${streetNumber} ${route}`.trim()
            if (!newPlaceData.address && place.formatted_address) {
              newPlaceData.address = place.formatted_address
            }
          }
          
          console.log('Selected place data:', newPlaceData)
          setPlaceData(newPlaceData)
          setFormData(prev => ({
            ...prev,
            ...newPlaceData
          }))
        })
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error)
      }
    }
  }, [googleLoaded])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Transform form data to match your schema
      const googlePlaceData = {
        business_status: formData.businessStatus,
        formatted_address: formData.formattedAddress,
        vicinity: formData.vicinity,
        utc_offset: formData.utcOffset,
        wheelchair_accessible_entrance: formData.wheelchairAccessible,
        price_level: formData.priceLevel ? parseInt(formData.priceLevel) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        user_ratings_total: formData.userRatingsTotal ? parseInt(formData.userRatingsTotal) : null,
        opening_hours: formData.openingHours ? JSON.parse(formData.openingHours) : null,
        curbside_pickup: formData.curbsidePickup,
        delivery: formData.delivery,
        dine_in: formData.dineIn,
        reservable: formData.reservable,
        takeout: formData.takeout,
        serves_beer: formData.servesBeer,
        serves_wine: formData.servesWine,
        serves_breakfast: formData.servesBreakfast,
        serves_brunch: formData.servesBrunch,
        serves_lunch: formData.servesLunch,
        serves_dinner: formData.servesDinner,
        serves_vegetarian_food: formData.servesVegetarian
      }
      
      // Add geometry data if lat/lng are available
      if (formData.latitude && formData.longitude) {
        googlePlaceData.geometry = {
          location: {
            lat: parseFloat(formData.latitude),
            lng: parseFloat(formData.longitude)
          }
        }
      }
      
      const currentTimestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
      
      const apiData = {
        id: establishment?.id || nanoid(), // Use existing ID or generate a new one
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        is_active: formData.isActive ? 1 : 0, // Use 1/0 for SQLite boolean
        place_id: formData.placeId,
        google_place_data: JSON.stringify(googlePlaceData),
        google_place_updated_at: currentTimestamp,
        created_at: establishment?.created_at || currentTimestamp,
        updated_at: currentTimestamp
      }
      
      console.log('Submitting establishment data to API:', apiData)
      
      // Make the actual API call
      const url = establishment ? `/api/establishments/${establishment.id}` : '/api/establishments'
      const method = establishment ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save establishment')
      }
      
      const data = await response.json()
      console.log('API response:', data)
      
      // Navigate back to establishments list
      router.push('/dashboard/establishments')
    } catch (error) {
      console.error('Error saving establishment:', error)
      setError(error.message || 'An error occurred while saving. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
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
            type="button"
            className={`pb-2 px-4 ${view === 'manual' 
              ? 'border-b-2 border-teal-700 font-medium text-teal-700' 
              : 'text-gray-500'}`}
            onClick={() => setView('manual')}
            style={{ display: 'none' }} // Hide manual button
          >
            Manual Entry
          </button>
          <button 
            type="button"
            className={`pb-2 px-4 ${view === 'google' 
              ? 'border-b-2 border-teal-700 font-medium text-teal-700' 
              : 'text-gray-500'}`}
            onClick={() => setView('google')}
          >
            Google Places Search
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {view === 'google' && (
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium">
                Search for your establishment
              </label>
              <input 
                ref={inputRef}
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Search for a restaurant, cafe, etc."
                id="google-places-autocomplete"
              />
              <p className="text-xs text-gray-500">
                Search for your establishment to automatically fill in address and contact details
              </p>
              
              {placeData && (
                <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
                  <p className="text-sm font-medium text-teal-800">Place selected:</p>
                  <p className="text-sm">{placeData.name}</p>
                  <p className="text-xs text-gray-600">{placeData.formattedAddress || placeData.address}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Establishment Name *
              </label>
              <input 
                id="name"
                name="name"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="The Green Bistro"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <label className="text-sm font-medium" htmlFor="isActive">
                  Active Status
                </label>
                <p className="text-sm text-gray-500">
                  Is this establishment currently active?
                </p>
              </div>
              <input 
                id="isActive"
                name="isActive"
                type="checkbox" 
                checked={formData.isActive}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="address">
              Address *
            </label>
            <input 
              id="address"
              name="address"
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city">
                City *
              </label>
              <input 
                id="city"
                name="city"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Anytown"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="state">
                State/Province *
              </label>
              <input 
                id="state"
                name="state"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="CA"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="zipCode">
                Zip/Postal Code *
              </label>
              <input 
                id="zipCode"
                name="zipCode"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="90210"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="country">
                Country *
              </label>
              <input 
                id="country"
                name="country"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="United States"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <PhoneIcon className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium" htmlFor="phone">
                  Phone Number
                </label>
              </div>
              <input 
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <PhoneIcon className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium" htmlFor="internationalPhone">
                  International Phone
                </label>
              </div>
              <input 
                id="internationalPhone"
                name="internationalPhone"
                type="tel"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="+1 555-123-4567"
                value={formData.internationalPhone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium" htmlFor="email">
                  Email Address
                </label>
              </div>
              <input 
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium" htmlFor="website">
                  Website
                </label>
              </div>
              <input 
                id="website"
                name="website"
                type="url"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://www.example.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <textarea 
              id="description"
              name="description"
              className="w-full min-h-24 px-3 py-2 border rounded-md"
              placeholder="A brief description of your establishment"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          {/* Business Attributes Section */}
          <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-medium">Business Attributes</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="curbsidePickup"
                  name="curbsidePickup"
                  checked={formData.curbsidePickup}
                  onChange={handleChange}
                />
                <label htmlFor="curbsidePickup" className="text-sm">Curbside Pickup</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="delivery"
                  name="delivery"
                  checked={formData.delivery}
                  onChange={handleChange}
                />
                <label htmlFor="delivery" className="text-sm">Delivery</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="dineIn"
                  name="dineIn"
                  checked={formData.dineIn}
                  onChange={handleChange}
                />
                <label htmlFor="dineIn" className="text-sm">Dine In</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="reservable"
                  name="reservable"
                  checked={formData.reservable}
                  onChange={handleChange}
                />
                <label htmlFor="reservable" className="text-sm">Reservable</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="takeout"
                  name="takeout"
                  checked={formData.takeout}
                  onChange={handleChange}
                />
                <label htmlFor="takeout" className="text-sm">Takeout</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="wheelchairAccessible"
                  name="wheelchairAccessible"
                  checked={formData.wheelchairAccessible}
                  onChange={handleChange}
                />
                <label htmlFor="wheelchairAccessible" className="text-sm">Wheelchair Accessible</label>
              </div>
            </div>
            
            <h3 className="font-medium mt-4">Dining Options</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="servesBreakfast"
                  name="servesBreakfast"
                  checked={formData.servesBreakfast}
                  onChange={handleChange}
                />
                <label htmlFor="servesBreakfast" className="text-sm">Serves Breakfast</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="servesBrunch"
                  name="servesBrunch"
                  checked={formData.servesBrunch}
                  onChange={handleChange}
                />
                <label htmlFor="servesBrunch" className="text-sm">Serves Brunch</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="servesLunch"
                  name="servesLunch"
                  checked={formData.servesLunch}
                  onChange={handleChange}
                />
                <label htmlFor="servesLunch" className="text-sm">Serves Lunch</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="servesDinner"
                  name="servesDinner"
                  checked={formData.servesDinner}
                  onChange={handleChange}
                />
                <label htmlFor="servesDinner" className="text-sm">Serves Dinner</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="servesVegetarian"
                  name="servesVegetarian"
                  checked={formData.servesVegetarian}
                  onChange={handleChange}
                />
                <label htmlFor="servesVegetarian" className="text-sm">Serves Vegetarian</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="servesBeer"
                  name="servesBeer"
                  checked={formData.servesBeer}
                  onChange={handleChange}
                />
                <label htmlFor="servesBeer" className="text-sm">Serves Beer</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="servesWine"
                  name="servesWine"
                  checked={formData.servesWine}
                  onChange={handleChange}
                />
                <label htmlFor="servesWine" className="text-sm">Serves Wine</label>
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="priceLevel">
                  Price Level
                </label>
                <select
                  id="priceLevel"
                  name="priceLevel"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.priceLevel}
                  onChange={handleChange}
                >
                  <option value="">Select Price Level</option>
                  <option value="0">Free</option>
                  <option value="1">Inexpensive</option>
                  <option value="2">Moderate</option>
                  <option value="3">Expensive</option>
                  <option value="4">Very Expensive</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="businessStatus">
                  Business Status
                </label>
                <select
                  id="businessStatus"
                  name="businessStatus"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.businessStatus}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="OPERATIONAL">Operational</option>
                  <option value="CLOSED_TEMPORARILY">Temporarily Closed</option>
                  <option value="CLOSED_PERMANENTLY">Permanently Closed</option>
                </select>
              </div>
            </div>
            
            {/* Hidden fields for additional data */}
            <input type="hidden" name="placeId" value={formData.placeId} />
            <input type="hidden" name="latitude" value={formData.latitude} />
            <input type="hidden" name="longitude" value={formData.longitude} />
            <input type="hidden" name="rating" value={formData.rating} />
            <input type="hidden" name="userRatingsTotal" value={formData.userRatingsTotal} />
            <input type="hidden" name="vicinity" value={formData.vicinity} />
            <input type="hidden" name="formattedAddress" value={formData.formattedAddress} />
            <input type="hidden" name="utcOffset" value={formData.utcOffset} />
            <input type="hidden" name="openingHours" value={formData.openingHours} />
          </div>
        
          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              className="px-4 py-2 border rounded-md"
              onClick={() => router.push('/dashboard/establishments')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-800 disabled:bg-teal-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : establishment ? 'Update Establishment' : 'Create Establishment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}