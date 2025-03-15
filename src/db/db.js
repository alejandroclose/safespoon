// src/db/db.js
import { drizzle } from 'drizzle-orm/d1';

// This function will try to get the D1 database from different sources
// depending on the environment
export function getDatabase(env) {
  // Check if we're in the browser (client-side)
  if (typeof window !== 'undefined') {
    console.warn('Attempted to access database from client-side code');
    return null;
  }
  
  // First try from the environment variable
  if (process.env.D1_DATABASE_ID) {
    return drizzle(env.D1_DATABASE);
  }
  
  // For local development using wrangler
  if (env && env.DB) {
    return drizzle(env.DB);
  }
  
  // For production deployment on Cloudflare Pages
  if (env && env.Bindings && env.Bindings.DB) {
    return drizzle(env.Bindings.DB);
  }
  
  // Log error but don't throw in production
  console.error('D1 database not available');
  return null;
}

// Export the database instance
let db;

// For client-side usage, we need to lazily initialize the db
// to avoid issues with environment variables during SSR/build
export function initDb(env) {
  // Skip initialization on client side
  if (typeof window !== 'undefined') {
    return null;
  }
  
  // Only initialize if not already initialized
  if (!db) {
    db = getDatabase(env);
  }
  return db;
}

// For direct import in server components/API routes
export { db };