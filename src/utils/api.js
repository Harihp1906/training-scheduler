const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Thin wrapper around fetch — same signature as fetch(url, options),
// just prefixes the backend base URL and attaches the JWT if one exists.
// Public endpoints (e.g. Courses.jsx for logged-out visitors) still work
// since the header is only added when a token is present.
export function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}${path}`, { ...options, headers });
}
