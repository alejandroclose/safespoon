// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { getD1, execQuery, getOne, execWrite } from '@/db/db';

export async function POST(request, context) {
  try {
    console.log('Registration endpoint called');
    
    const { name, email, password } = await request.json();
    console.log('Registration data received:', { name, email, passwordLength: password?.length });
    
    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' }, 
        { status: 400 }
      );
    }
    
    // Get database connection
    try {
      const db = getD1(context);
      
      // Check if email already exists
      const existingUser = await getOne(
        db,
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
      );
      
      if (existingUser) {
        console.log('Email already exists:', email);
        return NextResponse.json(
          { error: 'Email already exists' }, 
          { status: 409 }
        );
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Generate user ID
      const userId = nanoid();
      
      // Create timestamp (Unix timestamp in seconds)
      const timestamp = Math.floor(Date.now() / 1000);
      
      // Insert the new user
      await execWrite(
        db,
        `INSERT INTO users (
          id, name, email, password, user_type, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          name,
          email,
          hashedPassword,
          'establishment_owner',
          timestamp,
          timestamp
        ]
      );
      
      console.log('User created successfully:', userId);
      
      // Return success
      return NextResponse.json({ 
        success: true,
        user: {
          id: userId,
          name,
          email
        }
      }, { status: 201 });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError.message }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    );
  }
}