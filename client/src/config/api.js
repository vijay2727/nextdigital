/**
 * DigitalNext Production API Client Configuration
 * Automatically switches between local development server and remote Render backend API
 */

// Retrieve API base from environment variable, fallback to local dev port 5000
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Ensure no trailing slash
export const API_BASE = rawBase.replace(/\/+$/, '');

/**
 * Builds a complete normalized API URL for any endpoint
 * @param {string} endpoint - e.g. '/api/inquiries' or 'api/auth/login'
 * @returns {string} - Fully qualified URL e.g. 'https://my-backend.onrender.com/api/inquiries'
 */
export const buildApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};

/**
 * Robust fetch wrapper with automatic JSON handling and error parsing
 * @param {string} endpoint - API path (e.g. '/api/checkout')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  const headers = {
    'Accept': 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || response.statusText || 'API request failed';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export default {
  API_BASE,
  buildApiUrl,
  apiFetch
};
