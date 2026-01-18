import { API_URL } from '../config';
import { auth } from '../firebase';

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function openEventSource(path, params = {}) {
  const token = await getAuthToken();
  const url = new URL(path.startsWith('http') ? path : `${API_URL}${path}`);
  if (token) url.searchParams.set('token', token);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url.searchParams.set(k, String(v));
  });
  return new EventSource(url.toString());
}

export async function apiFetch(path, options = {}) {
  const token = await getAuthToken();
  const timeoutMs = Number(options.timeoutMs ?? 15000);
  const requestLabel = options.requestLabel || `${String(options.method || 'GET').toUpperCase()} ${path}`;
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  // Prevent requests from hanging forever.
  const controller = options.signal ? null : new AbortController();
  const signal = options.signal || controller?.signal;
  let didTimeout = false;
  const timeoutId = controller
    ? setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, timeoutMs)
    : null;

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      signal,
    });
  } catch (e) {
    if (timeoutId) clearTimeout(timeoutId);
    const msg = e?.name === 'AbortError'
      ? (didTimeout ? `Request timed out (${requestLabel})` : 'Request cancelled')
      : (e?.message || 'Network error');
    const err = new Error(msg);
    err.cause = e;
    throw err;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');

  if (!res.ok) {
    const detail = body?.detail || body?.message || (typeof body === 'string' ? body : null) || res.statusText;
    const err = new Error(detail);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export function getJson(path, options = {}) {
  return apiFetch(path, { method: 'GET', ...(options || {}) });
}

export function postJson(path, data, options = {}) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data ?? {}),
    ...(options || {}),
  });
}
