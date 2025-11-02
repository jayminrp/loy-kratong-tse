// API base URL - can be set via environment variable VITE_API_URL
// For production on Render, set this in your environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Fetch all kratongs from the API
 */
export async function fetchKratongs() {
  try {
    const response = await fetch(`${API_BASE_URL}/kratong`);
    if (!response.ok) {
      throw new Error(`Failed to fetch kratongs: ${response.statusText}`);
    }
    const data = await response.json();
    return data.kratongs || [];
  } catch (err) {
    console.error('fetchKratongs error', err);
    return [];
  }
}

/**
 * Create a new kratong via the API
 */
export async function createKratong(kratongData) {
  try {
    const response = await fetch(`${API_BASE_URL}/kratong`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kratongData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create kratong: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('createKratong error', err);
    throw err;
  }
}

