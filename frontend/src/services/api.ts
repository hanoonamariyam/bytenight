// Base API service configuration
// Prepared for seamless transition to FastAPI backend endpoints:
// VITE_API_BASE_URL defaults to '/api'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Toggle between mock local state and live FastAPI endpoints
// Defaults to false (use real backend) unless explicitly set to 'true'
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Helper to simulate realistic network latency during mock execution
export const simulateLatency = (ms: number = 250): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('bytenight_token');
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${cleanBase}${cleanPath}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}
