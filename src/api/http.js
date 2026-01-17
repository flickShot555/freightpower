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
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

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

export function getJson(path) {
  return apiFetch(path, { method: 'GET' });
}

export function postJson(path, data) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data ?? {}),
  });
}
