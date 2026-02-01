import axios from "axios"; // axios → HTTP client for making API requests

const API_BASE_URL = "http://127.0.0.1:8000/api"; // base URL for all endpoints

// Helper function → creates headers with authentication token
// token → JWT/Token from localStorage
// Every authenticated request needs this header
const getAuthHeaders = (token) => {
  if (token) {
    // If token exists, include it in Authorization header
    // Format: "Token <actual_token>" (required by Django REST Framework)
    return {
      Authorization: `Token ${token}`,
    };
  }
  // If no token, return empty object (used for login endpoint)
  return {};
};

// Login function → authenticates user and returns token
// username → user's login username
// password → user's login password
// Returns response with token on success
export const login = (username, password) => {
  return axios.post(`${API_BASE_URL}/login/`, {
    username,
    password,
  });
};

// Upload CSV file → requires authentication
// file → CSV file selected by user
// token → authentication token from localStorage
// FormData() → required format for file uploads (not JSON)
export const uploadCSV = (file, token) => {
  const formData = new FormData(); // FormData() → required for file upload
  formData.append("file", file); // "file" → must match Django (request.FILES["file"])

  return axios.post(`${API_BASE_URL}/upload/`, formData, {
    // Include authentication header with every upload request
    headers: getAuthHeaders(token),
  });
};

// Fetch upload history → requires authentication
// token → authentication token from localStorage
// Returns list of previous uploads
export const fetchHistory = (token) => {
  return axios.get(`${API_BASE_URL}/history/`, {
    // Include authentication header with every history request
    headers: getAuthHeaders(token),
  });
};
