// src/db/db.js
import { drizzle } from 'drizzle-orm/d1';

// This function will try to get the D1 database from different sources
// depending on the environment
export function getDatabase(env) {
  // First try from the environment variable
  if (process.env.D1_DATABASE_ID) {
    return drizzle(env.D1_DATABASE);
  }
  
  // For local development using wrangler
  if (env.DB) {
    return drizzle(env.DB);
  }
  
  // For production deployment on Cloudflare Pages
  if (env.Bindings && env.Bindings.DB) {
    return drizzle(env.Bindings.DB);
  }
  
  // Fallback to error
  throw new Error('D1 database not available');
}

// Export the database instance
let db;

// For client-side usage, we need to lazily initialize the db
// to avoid issues with environment variables during SSR/build
export function initDb(env) {
  if (!db) {
    db = getDatabase(env);
  }
  return db;
}

// For direct import in server components/API routes
export { db };