const API_BASE_URL = 'https://samadhan-setu-f7pe.onrender.com/api';

export const apiRequest = async (endpoint, options = {}) => {
  // Automatically fix missing leading slashes (e.g., 'auth/login' becomes '/auth/login')
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const token = 
    localStorage.getItem('jh_token') || 
    localStorage.getItem('token') || 
    localStorage.getItem('userToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Automatically stringify body if it's an object
  let requestBody = options.body;
  if (requestBody && typeof requestBody === 'object' && !(requestBody instanceof FormData)) {
    requestBody = JSON.stringify(requestBody);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${formattedEndpoint}`, {
      ...options,
      headers,
      body: requestBody,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (networkError) {
    // This catches if the server is offline or CORS blocked
    console.error(`API Fetch Error [${formattedEndpoint}]:`, networkError);
    throw networkError;
  }
};