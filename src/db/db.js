// src/db/db.js

/**
 * Get the D1 database instance from the context
 * 
 * For Cloudflare Pages/Workers, the D1 binding is available directly in the
 * environment object passed to the route handler.
 * 
 * @param {Object} context - The request context (may contain env or context.env)
 * @returns {Object} D1 database instance
 */
export function getD1(context) {
    // Try to get DB from different locations depending on the environment
    const db = 
      (context?.env?.DB) || // Route handler in Cloudflare Workers
      (context?.DB) || // Direct D1 binding
      (global?.DB); // Global binding (if available)
    
    if (!db) {
      console.error('D1 database binding not found in context');
      throw new Error('Database connection not available');
    }
    
    return db;
  }
  
  /**
   * Execute a prepared statement against D1
   * 
   * @param {Object} db - D1 database instance
   * @param {string} sql - SQL query with ? placeholders
   * @param {Array} params - Parameters to bind to the query
   * @returns {Promise<Object>} - Query results
   */
  export async function execQuery(db, sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      const bindStmt = stmt.bind(...params);
      const result = await bindStmt.all();
      return result;
    } catch (error) {
      console.error('Database query error:', error, { sql, params });
      throw error;
    }
  }
  
  /**
   * Execute a write operation (INSERT, UPDATE, DELETE)
   * 
   * @param {Object} db - D1 database instance
   * @param {string} sql - SQL query with ? placeholders
   * @param {Array} params - Parameters to bind to the query
   * @returns {Promise<Object>} - Query results
   */
  export async function execWrite(db, sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      const bindStmt = stmt.bind(...params);
      const result = await bindStmt.run();
      return result;
    } catch (error) {
      console.error('Database write error:', error, { sql, params });
      throw error;
    }
  }
  
  /**
   * Get a single row from D1
   * 
   * @param {Object} db - D1 database instance
   * @param {string} sql - SQL query with ? placeholders
   * @param {Array} params - Parameters to bind to the query
   * @returns {Promise<Object>} - First row or null
   */
  export async function getOne(db, sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      const bindStmt = stmt.bind(...params);
      const result = await bindStmt.first();
      return result;
    } catch (error) {
      console.error('Database query error:', error, { sql, params });
      throw error;
    }
  }