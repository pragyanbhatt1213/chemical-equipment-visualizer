// Configuration utilities for environment variables
// Ensures deployment compatibility with Vercel and other platforms

// API Base URL configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// API endpoints
export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/login/`,
  upload: `${API_BASE_URL}/upload/`,
  history: `${API_BASE_URL}/history/`,
  generatePdf: (id) => `${API_BASE_URL}/generate-pdf/${id}/`,
  exportCsv: (id) => `${API_BASE_URL}/export/csv/${id}/`,
  exportExcel: (id) => `${API_BASE_URL}/export/excel/${id}/`,
};

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Default configuration values
export const DEFAULT_CONFIG = {
  apiTimeout: 30000, // 30 seconds
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.csv'],
  animationDuration: 300,
};

// Main configuration object
const config = {
  API_BASE_URL,
  API_ENDPOINTS,
  isDevelopment,
  isProduction,
  DEFAULT_CONFIG,
};

export default config;