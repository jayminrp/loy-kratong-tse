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
    // Also sync to localStorage as backup
    if (kratongs.length > 0) {
      localStorage.setItem(KEY, JSON.stringify(kratongs));
    }
    return kratongs;
  } catch (err) {
    console.error("loadKratongs error", err);
    // Fallback to localStorage if API fails
    return loadKratongsLocal();
  }
}

/**
 * Save kratong via API
 */
export async function saveKratong(newItem) {
  try {
    const saved = await createKratong(newItem);
    // Update localStorage as backup
    const current = loadKratongsLocal();
    const updated = [...current.filter(k => k.id !== saved.id), saved];
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("saveKratong error", err);
    // Fallback to localStorage if API fails
    const current = loadKratongsLocal();
    const updated = [...current, newItem];
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  }
}
