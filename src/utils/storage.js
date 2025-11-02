import { fetchKratongs, createKratong } from './api';

// Fallback to localStorage for offline support
const KEY = "kratongs";

export function loadKratongsLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("loadKratongsLocal error", err);
    return [];
  }
}

/**
 * Load kratongs from API
 */
export async function loadKratongs() {
  try {
    const kratongs = await fetchKratongs();
    console.log(`[Storage] Loaded ${kratongs.length} kratongs from API`);
    // Also sync to localStorage as backup
    if (kratongs.length > 0) {
      localStorage.setItem(KEY, JSON.stringify(kratongs));
      console.log(`[Storage] Synced ${kratongs.length} kratongs to localStorage`);
    }
    return kratongs;
  } catch (err) {
    console.error("[Storage] loadKratongs error, falling back to localStorage:", err);
    // Fallback to localStorage if API fails
    const localKratongs = loadKratongsLocal();
    console.log(`[Storage] Using ${localKratongs.length} kratongs from localStorage`);
    return localKratongs;
  }
}

/**
 * Save kratong via API
 */
export async function saveKratong(newItem) {
  try {
    console.log(`[Storage] Saving kratong to API:`, newItem);
    const saved = await createKratong(newItem);
    console.log(`[Storage] Successfully saved to API:`, saved);
    // Update localStorage as backup
    const current = loadKratongsLocal();
    const updated = [...current.filter(k => k.id !== saved.id), saved];
    localStorage.setItem(KEY, JSON.stringify(updated));
    console.log(`[Storage] Updated localStorage with ${updated.length} kratongs`);
    return updated;
  } catch (err) {
    console.error("[Storage] saveKratong error, falling back to localStorage:", err);
    // Fallback to localStorage if API fails
    const current = loadKratongsLocal();
    const updated = [...current, newItem];
    localStorage.setItem(KEY, JSON.stringify(updated));
    console.log(`[Storage] Saved to localStorage only (API failed):`, updated.length, "kratongs");
    return updated;
  }
}
