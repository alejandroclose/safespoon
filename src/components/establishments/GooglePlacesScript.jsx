// src/components/establishments/GooglePlacesScript.jsx
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function GooglePlacesScript() {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // Set the API key only on the client side
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '')
    
    // Add global error handler for Google Maps errors
    if (typeof window !== 'undefined') {
      window.gm_authFailure = () => {
        console.error('Google Maps authentication error');
        setError('Google Maps API authentication failed. Please check your API key.');
      };
    }
  }, [])
  
  const handleScriptLoad = () => {
    console.log('Google Maps script loaded successfully');
  }
  
  const handleScriptError = (error) => {
    console.error('Error loading Google Maps script:', error);
    setError('Failed to load Google Maps. Please check your internet connection and API key.');
  }
  
  // Only render the script on the client side after the component has mounted
  if (!apiKey) return null
  
  return (
    <>
      {error && (
        <div className="p-3 my-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
          <p><strong>Error:</strong> {error}</p>
          <p className="mt-1 text-xs">
            If you're developing locally, make sure your API key allows localhost and has the 
            Places API enabled in the Google Cloud Console.
          </p>
        </div>
      )}
      
      <Script
        id="google-places-script"
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
    </>
  )
}