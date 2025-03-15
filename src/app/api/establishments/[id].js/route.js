// app/api/establishments/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { validateEstablishment } from '@/lib/validations'

// GET a single establishment by ID
export async function GET(request, { params }, env) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = params
    
    // Check if user has access to this establishment
    const userAccess = await env.DB.prepare(`
      SELECT eu.role
      FROM establishment_users eu
      WHERE eu.establishment_id = ? AND eu.user_id = ?
    `).bind(id, session.user.id).first()
    
    if (!userAccess) {
      return NextResponse.json(
        { error: 'You do not have permission to access this establishment' },
        { status: 403 }
      )
    }
    
    // Fetch the establishment details
    const establishment = await env.DB.prepare(`
      SELECT * FROM establishments
      WHERE id = ?
    `).bind(id).first()
    
    if (!establishment) {
      return NextResponse.json(
        { error: 'Establishment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(establishment)
  } catch (error) {
    console.error('Error fetching establishment:', error)
    return NextResponse.json(
      { error: 'Error fetching establishment: ' + error.message },
      { status: 500 }
    )
  }
}

// UPDATE an establishment
export async function PUT(request, { params }, env) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = params
    
    // Check if user has access to this establishment
    const userAccess = await env.DB.prepare(`
      SELECT eu.role
      FROM establishment_users eu
      WHERE eu.establishment_id = ? AND eu.user_id = ?
    `).bind(id, session.user.id).first()
    
    if (!userAccess) {
      return NextResponse.json(
        { error: 'You do not have permission to update this establishment' },
        { status: 403 }
      )
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
    
    // Get current timestamp in seconds for SQLite
    const currentTimestamp = Math.floor(Date.now() / 1000)
    
    // Update the establishment
    await env.DB.prepare(`
      UPDATE establishments
      SET 
        name = ?,
        description = ?,
        address = ?,
        city = ?,
        state = ?,
        postal_code = ?,
        country = ?,
        phone = ?,
        email = ?,
        website = ?,
        is_active = ?,
        place_id = ?,
        google_place_data = ?,
        google_place_updated_at = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
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
      body.is_active,
      body.place_id || null,
      body.google_place_data || null,
      body.google_place_updated_at || currentTimestamp,
      currentTimestamp,
      id
    ).run()
    
    return NextResponse.json({
      message: 'Establishment updated successfully',
      id: id
    })
  } catch (error) {
    console.error('Error updating establishment:', error)
    return NextResponse.json(
      { error: 'Error updating establishment: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE an establishment
export async function DELETE(request, { params }, env) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = params
    
    // Check if user has owner access to this establishment
    const userAccess = await env.DB.prepare(`
      SELECT eu.role
      FROM establishment_users eu
      WHERE eu.establishment_id = ? AND eu.user_id = ? AND eu.role = 'owner'
    `).bind(id, session.user.id).first()
    
    if (!userAccess) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this establishment' },
        { status: 403 }
      )
    }
    
    // Delete the establishment (cascade will handle relationships)
    await env.DB.prepare(`
      DELETE FROM establishments
      WHERE id = ?
    `).bind(id).run()
    
    return NextResponse.json({
      message: 'Establishment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting establishment:', error)
    return NextResponse.json(
      { error: 'Error deleting establishment: ' + error.message },
      { status: 500 }
    )
  }
}