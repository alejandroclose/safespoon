// lib/validations.js
import { z } from 'zod'

// Establishment validation schema
export const establishmentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().nullable(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  postal_code: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  phone: z.string().optional().nullable(),
  email: z.string().email({ message: "Invalid email address" }).optional().nullable(),
  website: z.string().url({ message: "Invalid website URL" }).optional().nullable(),
  is_active: z.boolean().default(true),
  place_id: z.string().optional().nullable(),
  google_place_data: z.any().optional().nullable(),
  google_place_updated_at: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable()
})

// Validate establishment data
export function validateEstablishment(data) {
  try {
    const validatedData = establishmentSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    return { success: false, error: error.errors }
  }
}