export function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    // Add padding for base64 decoding
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(b64.padEnd(b64.length + (4 - (b64.length % 4 || 4)) % 4, '='));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// Prefer a per-tab session token, fallback to localStorage for backward compatibility
export function getToken() {
  return (
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('token')) ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('token')) ||
    null
  );
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeJWT(token);
  if (!payload) return null;
  // Optional: expiry check if `exp` exists
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    try { sessionStorage.removeItem('token'); } catch {}
    try { localStorage.removeItem('token'); } catch {}
    return null;
  }
  return payload;
}

export function isAuthenticated() {
  return !!getUserFromToken();
}

export function logout() {
  try { sessionStorage.removeItem('token'); } catch {}
  try { localStorage.removeItem('token'); } catch {}
}
