// src/db/schema.js
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users table schema
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  user_type: text('user_type').notNull().default('establishment_owner'),
  created_at: integer('created_at'),
  updated_at: integer('updated_at')
});

// Add other tables as needed
export const establishments = sqliteTable('establishments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state'),
  postal_code: text('postal_code').notNull(),
  country: text('country').notNull(),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  is_active: integer('is_active').default(1),
  created_at: integer('created_at'),
  updated_at: integer('updated_at')
});