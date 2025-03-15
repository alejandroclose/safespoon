// app/api/establishments/route.js
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { validateEstablishment } from '@/lib/validations'

// GET all establishments for current user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get user ID from session
    const userId = session.user.id
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // Fetch establishments with search filter
    const { rows } = await sql`
      SELECT e.*
      FROM establishments e
      JOIN user_establishments ue ON e.id = ue.establishment_id
      WHERE ue.user_id = ${userId}
        AND (
          e.name ILIKE ${`%${search}%`} OR
          e.address ILIKE ${`%${search}%`} OR
          e.city ILIKE ${`%${search}%`}
        )
      ORDER BY e.name ASC
    `
    
    return NextResponse.json({ establishments: rows })
  } catch (error) {
    console.error('Error fetching establishments:', error)
    return NextResponse.json(
      { error: 'Error fetching establishments' },
      { status: 500 }
    )
  }
}

// CREATE a new establishment
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get user ID from session
    const userId = session.user.id
    
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
    
    // Create establishment in database
    const { 
      name, description, address, city, state, postal_code, country,
      phone, email, website, is_active, place_id, google_place_data,
      google_place_updated_at, logo_url, cover_image_url
    } = body
    
    // Insert into establishments table
    const { rows } = await sql`
      INSERT INTO establishments (
        name, description, address, city, state, postal_code, country,
        phone, email, website, is_active, place_id, google_place_data,
        google_place_updated_at, logo_url, cover_image_url, created_at, updated_at
      ) VALUES (
        ${name}, ${description || null}, ${address}, ${city}, ${state}, 
        ${postal_code}, ${country}, ${phone || null}, ${email || null},
        ${website || null}, ${is_active}, ${place_id || null}, 
        ${google_place_data ? JSON.stringify(google_place_data) : null},
        ${google_place_updated_at || null}, ${logo_url || null}, 
        ${cover_image_url || null}, NOW(), NOW()
      )
      RETURNING id
    `
    
    const establishmentId = rows[0].id
    
    // Associate establishment with user
    await sql`
      INSERT INTO user_establishments (user_id, establishment_id, role)
      VALUES (${userId}, ${establishmentId}, 'owner')
    `
    
    return NextResponse.json({ 
      message: 'Establishment created successfully',
      id: establishmentId
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating establishment:', error)
    return NextResponse.json(
      { error: 'Error creating establishment' },
      { status: 500 }
    )
  }
}