// API Endpoints
export const API_ENDPOINTS = {
  GRAPH: 'https://graph.microsoft.com/v1.0',
  DATAVERSE: process.env.REACT_APP_DATAVERSE_URL || '',
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SHAREPOINT: '/sharepoint',
  DATAVERSE: '/dataverse',
  OUTLOOK: '/outlook',
  SETTINGS: '/settings',
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  PREFERENCES: 'user_preferences',
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Authentication failed. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  API_ERROR: 'An error occurred while communicating with the server.',
  NOT_FOUND: 'The requested resource was not found.',
  PERMISSION_DENIED: 'You do not have permission to access this resource.',
};
