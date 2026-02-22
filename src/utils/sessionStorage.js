const KEY = "spydle_session";

export function saveSession(roomCode, role) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ roomCode, role }));
  } catch (_) {}
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch (_) {}
}
