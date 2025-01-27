const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000'
  : 'https://api.your-production-domain.com'; // Replace with your actual production API URL

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
