// API base URL - can be set via environment variable VITE_API_URL
// For production on Render, set this in your environment variables
// Backend API: https://loy-kratong-api.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loy-kratong-api.onrender.com';

/**
 * Fetch all kratongs from the API
 */
export async function fetchKratongs() {
  try {
    console.log(`[API] Fetching kratongs from: ${API_BASE_URL}/kratong`);
    const response = await fetch(`${API_BASE_URL}/kratong`);
    if (!response.ok) {
      console.error(`[API] Failed to fetch: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch kratongs: ${response.statusText}`);
    }
    const data = await response.json();
    const kratongs = data.kratongs || [];
    console.log(`[API] Successfully fetched ${kratongs.length} kratongs`);
    return kratongs;
  } catch (err) {
    console.error('[API] fetchKratongs error:', err);
    return [];
  }
}

/**
 * Create a new kratong via the API
 */
export async function createKratong(kratongData) {
  try {
    console.log(`[API] Creating kratong at: ${API_BASE_URL}/kratong`, kratongData);
    const response = await fetch(`${API_BASE_URL}/kratong`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kratongData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Failed to create: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to create kratong: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`[API] Successfully created kratong:`, data);
    return data;
  } catch (err) {
    console.error('[API] createKratong error:', err);
    throw err;
  }
}

