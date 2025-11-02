const KEY = "kratongs";

export function loadKratongs() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("loadKratongs error", err);
    return [];
  }
}

export function saveKratong(newItem) {
  const current = loadKratongs();
  const updated = [...current, newItem];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
