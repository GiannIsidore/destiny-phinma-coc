// Get the current hostname
const hostname = window.location.hostname;

// Determine if we're running on localtunnel
const isLocaltunnel = hostname.includes('.loca.lt');

// Set the base URL accordingly
export const BASE_URL = isLocaltunnel
  ? 'https://phinma.loca.lt/destiny-phinma-coc/'  // Backend tunnel URL
  : 'http://localhost/destiny-phinma-coc/';       // Local development

export const API_URL = `${BASE_URL}api`;

// Common fetch options for API calls
export const fetchOptions = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
