// Base API service configuration
// Prepared for seamless transition to FastAPI backend endpoints:
// VITE_API_BASE_URL (defaults to '/api/v1')

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Toggle between mock local state and live FastAPI endpoints
// Defaults to true during frontend hackathon checkpoint
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Helper to simulate realistic network latency during mock execution
export const simulateLatency = (ms: number = 250): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
