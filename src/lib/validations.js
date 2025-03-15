// lib/validations.js

/**
 * Validates an establishment object
 * @param {Object} establishment - Establishment data to validate
 * @returns {Object} - Result indicating if validation was successful
 */
export function validateEstablishment(establishment) {
    const errors = [];
    
    // Required fields
    const requiredFields = ['name', 'address', 'city', 'postal_code', 'country'];
    
    for (const field of requiredFields) {
      if (!establishment[field] || establishment[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    }
    
    // Email validation if provided
    if (establishment.email && !isValidEmail(establishment.email)) {
      errors.push('Invalid email format');
    }
  
    // Website URL validation if provided
    if (establishment.website && !isValidUrl(establishment.website)) {
      errors.push('Invalid website URL');
    }
    
    // Validate google_place_data is valid JSON string if provided as string
    if (typeof establishment.google_place_data === 'string') {
      try {
        JSON.parse(establishment.google_place_data);
      } catch (error) {
        errors.push('google_place_data must be valid JSON');
      }
    }
    
    return {
      success: errors.length === 0,
      error: errors
    };
  }
  
  /**
   * Validates an email address
   * @param {string} email - Email to validate
   * @returns {boolean} - True if email is valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validates a URL
   * @param {string} url - URL to validate
   * @returns {boolean} - True if URL is valid
   */
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }