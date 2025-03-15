// app/api/establishments/route.js
import { NextResponse } from 'next/server'
import { validateEstablishment } from '@/lib/validations'
import { nanoid } from 'nanoid'

// GET all establishments
export async function GET(request) {
  try {
    // In the Cloudflare Pages + Next.js setup, D1 is available on request.D1
    // or may be available through a different mechanism depending on your setup
    const DB = process.env.D1_DB || request.D1;
    
    if (!DB) {
      throw new Error('Database connection not available');
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const searchTerm = `%${search}%`
    
    // Fetch establishments using D1
    const establishments = await DB.prepare(`
      SELECT *
      FROM establishments
      WHERE 
        name LIKE ? OR
        address LIKE ? OR
        city LIKE ?
      ORDER BY name ASC
    `).bind(searchTerm, searchTerm, searchTerm).all()
    
    return NextResponse.json({ establishments: establishments.results || [] })
  } catch (error) {
    console.error('Error fetching establishments:', error)
    return NextResponse.json(
      { error: 'Error fetching establishments: ' + error.message },
      { status: 500 }
    )
  }
}

// CREATE a new establishment
export async function POST(request) {
  try {
    // Access database
    const DB = process.env.D1_DB || request.D1;
    
    if (!DB) {
      throw new Error('Database connection not available');
    }
    
    // Get request body
    const body = await request.json()
    
    // Validate establishment data
    const validation = validateEstablishment(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid establishment data', details: validation.error },
        { status: 400 }
      )
    }
    
    // Generate a unique ID if not provided
    const establishmentId = body.id || nanoid()
    
    // Get current timestamp in seconds (SQLite format)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    
    console.log('Creating establishment:', {
      id: establishmentId,
      name: body.name,
      timestamp: currentTimestamp
    })
    
    // Insert into establishments table using D1
    await DB.prepare(`
      INSERT INTO establishments (
        id, name, description, address, city, state, postal_code, country,
        phone, email, website, is_active, place_id, google_place_data,
        google_place_updated_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      establishmentId,
      body.name, 
      body.description || null, 
      body.address, 
      body.city, 
      body.state, 
      body.postal_code, 
      body.country, 
      body.phone || null, 
      body.email || null,
      body.website || null, 
      body.is_active || 1, 
      body.place_id || null, 
      body.google_place_data || null,
      body.google_place_updated_at || currentTimestamp, 
      body.created_at || currentTimestamp, 
      currentTimestamp
    ).run()
    
    return NextResponse.json({ 
      message: 'Establishment created successfully',
      id: establishmentId
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating establishment:', error)
    return NextResponse.json(
      { error: 'Error creating establishment: ' + error.message },
      { status: 500 }
    )
  }
}