// src/db/db.js
import { drizzle } from 'drizzle-orm/d1';

// Store a single database instance
let db;

/**
 * Get a database instance from the environment
 * @param {Object} env - Environment variables and bindings
 * @returns {Object} - Database instance
 */
export function getDatabase(env) {
  try {
    // For Cloudflare Pages/Workers where DB is available in env
    if (env && env.DB) {
      console.log('Using DB binding from environment');
      return drizzle(env.DB);
    }
    
    // For Cloudflare Pages where DB is in Bindings
    if (env && env.Bindings && env.Bindings.DB) {
      console.log('Using DB binding from Bindings');
      return drizzle(env.Bindings.DB);
    }
    
    // For local development
    if (process.env.NODE_ENV === 'development') {
      console.log('Development environment detected - using mock DB');
      return createMockDb();
    }
    
    console.error('No database binding found in environment');
    return createMockDb();
  } catch (error) {
    console.error('Error initializing database:', error);
    return createMockDb();
  }
}

/**
 * Create a mock database for development/fallback
 * @returns {Object} - Mock database with drizzle-compatible interface
 */
function createMockDb() {
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => []
        })
      })
    }),
    insert: () => ({
      values: () => ({})
    }),
    update: () => ({
      set: () => ({
        where: () => ({})
      })
    }),
    delete: () => ({
      where: () => ({})
    })
  };
}

/**
 * Initialize the database lazily
 * @param {Object} env - Environment variables and bindings
 * @returns {Object} - Database instance
 */
export function initDb(env = {}) {
  if (!db) {
    console.log('Initializing database');
    db = getDatabase(env);
  }
  return db;
}

/**
 * Export the database instance for direct import in server components
 * Note: This will be undefined during build time and server-side rendering,
 * but will be populated when used in client components after mount or in API routes
 */
export { db };