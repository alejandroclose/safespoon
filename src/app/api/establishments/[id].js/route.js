// app/api/establishments/[id]/route.js
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { validateEstablishment } from '@/lib/validations'

// Helper function to check if user has access to establishment
async function checkEstablishmentAccess(userId, establishmentId) {
    const { rows } = await sql`
    SELECT 1
    FROM user_establishments
    WHERE user_id = ${userId}
      AND establishment_id = ${establishmentId}
    LIMIT 1
  `
    return rows.length > 0
}

// GET a specific establishment
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const establishmentId = params.id
        const userId = session.user.id

        // Check if user has access to establishment
        const hasAccess = await checkEstablishmentAccess(userId, establishmentId)
        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Access denied to this establishment' },
                { status: 403 }
            )
        }

        // Fetch establishment details
        const { rows } = await sql`
      SELECT *
      FROM establishments
      WHERE id = ${establishmentId}
    `

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Establishment not found' },
                { status: 404 }
            )
        }

        // Fetch users associated with this establishment
        const { rows: users } = await sql`
      SELECT u.id, u.name, u.email, ue.role
      FROM users u
      JOIN user_establishments ue ON u.id = ue.user_id
      WHERE ue.establishment_id = ${establishmentId}
    `

        // Fetch active menus count
        const { rows: menuCount } = await sql`
      SELECT COUNT(*) as count
      FROM menus
      WHERE establishment_id = ${establishmentId}
        AND is_active = true
    `

        return NextResponse.json({
            ...rows[0],
            users,
            activeMenus: parseInt(menuCount[0].count)
        })

    } catch (error) {
        console.error('Error fetching establishment:', error)
        return NextResponse.json(
            { error: 'Error fetching establishment' },
            { status: 500 }
        )
    }
}

// UPDATE an establishment
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const establishmentId = params.id
        const userId = session.user.id

        // Check if user has access to establishment
        const hasAccess = await checkEstablishmentAccess(userId, establishmentId)
        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Access denied to this establishment' },
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

        const {
            name, description, address, city, state, postal_code, country,
            phone, email, website, is_active, place_id, google_place_data,
            google_place_updated_at, logo_url, cover_image_url
        } = body

        // Update establishment in database
        await sql`
      UPDATE establishments
      SET
        name = ${name},
        description = ${description || null},
        address = ${address},
        city = ${city},
        state = ${state},
        postal_code = ${postal_code},
        country = ${country},
        phone = ${phone || null},
        email = ${email || null},
        website = ${website || null},
        is_active = ${is_active},
        place_id = ${place_id || null},
        google_place_data = ${google_place_data ? JSON.stringify(google_place_data) : null},
        google_place_updated_at = ${google_place_updated_at || null},
        logo_url = ${logo_url || null},
        cover_image_url = ${cover_image_url || null},
        updated_at = NOW()
      WHERE id = ${establishmentId}
    `

        return NextResponse.json({
            message: 'Establishment updated successfully',
            id: establishmentId
        })

    } catch (error) {
        console.error('Error updating establishment:', error)
        return NextResponse.json(
            { error: 'Error updating establishment' },
            { status: 500 }
        )
    }
}

// DELETE an establishment
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const establishmentId = params.id
        const userId = session.user.id

        // Check if user has access to establishment
        const hasAccess = await checkEstablishmentAccess(userId, establishmentId)
        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Access denied to this establishment' },
                { status: 403 }
            )
        }

        // First delete the association with users
        await sql`
      DELETE FROM user_establishments
      WHERE establishment_id = ${establishmentId}
    `

        // Remove menu-establishment associations
        await sql`
      DELETE FROM menu_establishments
      WHERE establishment_id = ${establishmentId}
    `

        // Delete the establishment
        await sql`
      DELETE FROM establishments
      WHERE id = ${establishmentId}
    `

        return NextResponse.json({
            message: 'Establishment deleted successfully'
        })

    } catch (error) {
        console.error('Error deleting establishment:', error)
        return NextResponse.json(
            { error: 'Error deleting establishment' },
            { status: 500 }
        )
    }
}