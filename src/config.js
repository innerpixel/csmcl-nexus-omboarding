const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000'
  : 'https://csmcl-nexus.github.io/omboarding/api'; // Using GitHub Pages path for now

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
