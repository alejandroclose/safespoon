// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { getDatabase } from '@/db/db';

export async function POST(request) {
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
    const db = getDatabase(process.env);
    
    if (!db) {
      console.error('Database connection failed in registration');
      return NextResponse.json(
        { error: 'Database connection failed' }, 
        { status: 500 }
      );
    }
    
    // Check if email already exists
    try {
      const existingUsers = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.email, email),
        limit: 1
      });
      
      if (existingUsers.length > 0) {
        console.log('Email already exists:', email);
        return NextResponse.json(
          { error: 'Email already exists' }, 
          { status: 409 }
        );
      }
    } catch (queryError) {
      console.error('Error checking existing user:', queryError);
      return NextResponse.json(
        { error: 'Error checking existing user' }, 
        { status: 500 }
      );
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate user ID
    const userId = nanoid();
    
    // Create timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create user
    try {
      await db.insert(db.schema.users).values({
        id: userId,
        name,
        email,
        password: hashedPassword,
        user_type: 'establishment_owner',
        created_at: timestamp,
        updated_at: timestamp
      });
      console.log('User created successfully:', userId);
    } catch (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user account', details: insertError.message }, 
        { status: 500 }
      );
    }
    
    // Return success
    return NextResponse.json({ 
      success: true,
      user: {
        id: userId,
        name,
        email
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    );
  }
}