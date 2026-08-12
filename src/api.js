/**
 * HTTP client for the Dhruv API.
 *
 * The backend authenticates with an HttpOnly session cookie, so every request must send
 * credentials, and every state-changing request must carry a CSRF token. Previously the
 * client sent no credentials at all: identity was a user object kept in localStorage and
 * the server verified nothing.
 */

/**
 * Normalises VITE_BACKEND_URL into an absolute origin, or an empty string to use the
 * current origin (the local Vite proxy setup).
 *
 * A value without a scheme — `api.example.com` rather than `https://api.example.com` —
 * is a relative path as far as fetch is concerned, so every request silently resolves
 * against the frontend's own origin and hits the SPA rewrite instead of the API. That
 * surfaces as a baffling 405 on POST, so repair it here and say so loudly.
 */
function resolveBaseUrl(raw) {
  const value = (raw || '').trim().replace(/\/+$/, '');
  if (!value) return '';

  if (/^https?:\/\//i.test(value)) return value;

  const repaired = `https://${value}`;
  console.error(
    `VITE_BACKEND_URL is missing a scheme ("${value}"). Without one it is treated as a ` +
    `path relative to this site, so API calls never reach the backend. ` +
    `Set it to "${repaired}" and redeploy — Vite inlines this value at build time.`,
  );
  return repaired;
}

const BASE_URL = resolveBaseUrl(import.meta.env.VITE_BACKEND_URL);

/** Kept in memory, not localStorage: a token in storage outlives the tab and leaks via XSS. */
let csrfToken = null;

export const getApiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BASE_URL}${path}`;
};

/** WebSocket origin derived from the API base, so it follows the same deployment config. */
export const getWebSocketUrl = (path) => {
  if (BASE_URL) {
    return `${BASE_URL.replace(/^http/, 'ws')}${path}`;
  }
  const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${scheme}://${window.location.host}${path}`;
};

/**
 * An API call that failed. Carries the server's stable `code` so callers branch on that
 * instead of substring-matching a human-readable sentence.
 */
export class ApiError extends Error {
  constructor(message, { code, status, fields } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code || 'UNKNOWN';
    this.status = status ?? 0;
    this.fields = fields || null;
  }

  get isAuthError() {
    return this.status === 401;
  }
}

/**
 * Fetches a CSRF token. Sign-in is a POST, so the very first request of a session needs
 * a token before it can be sent.
 */
export async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  try {
    const res = await fetch(getApiUrl('/api/v1/auth/csrf'), { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      csrfToken = data.csrfToken || null;
    }
  } catch {
    // Offline or the API is unreachable; the caller's request will surface the failure.
  }
  return csrfToken;
}

export function setCsrfToken(token) {
  if (token) csrfToken = token;
}

export function clearCsrfToken() {
  csrfToken = null;
}

/**
 * Performs an API request with credentials and CSRF handling.
 *
 * @throws {ApiError} on any non-2xx response or network failure
 */
export async function apiFetch(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...rest } = options;
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());

  if (isMutation) {
    await ensureCsrfToken();
  }

  const requestHeaders = { Accept: 'application/json', ...headers };
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (isMutation && csrfToken) {
    requestHeaders['X-XSRF-TOKEN'] = csrfToken;
  }

  let response;
  try {
    response = await fetch(getApiUrl(endpoint), {
      method,
      credentials: 'include', // sends the session cookie cross-origin
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      ...rest,
    });
  } catch {
    throw new ApiError(
      'Cannot reach the Dhruv server. Check your connection and try again.',
      { code: 'NETWORK_ERROR' },
    );
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    // A rejected CSRF token usually means the session was recycled server-side; drop the
    // cached token so the next mutation fetches a fresh one instead of looping on 403.
    if (response.status === 403) clearCsrfToken();
    if (response.status === 401) clearCsrfToken();

    throw new ApiError(
      payload?.message || defaultMessageFor(response.status),
      { code: payload?.code, status: response.status, fields: payload?.fields },
    );
  }

  // Auth responses carry a refreshed token for the newly rotated session.
  if (payload?.csrfToken) setCsrfToken(payload.csrfToken);

  return payload;
}

function defaultMessageFor(status) {
  if (status === 401) return 'Please sign in to continue.';
  if (status === 403) return 'You do not have access to this.';
  if (status === 404) return 'That resource could not be found.';
  if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
  if (status >= 500) return 'Something went wrong on our side. Please try again shortly.';
  return 'Request failed. Please try again.';
}
