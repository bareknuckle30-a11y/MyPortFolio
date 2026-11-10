// Thin fetch wrapper for the Express API. Errors carry the server's message and per-field errors.

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status, code, fields } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields || {};
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Could not reach the server. Check your connection and try again.', { code: 'network' });
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const e = data?.error || {};
    throw new ApiError(e.message || 'Something went wrong. Please try again.', { status: res.status, code: e.code, fields: e.fields });
  }
  return data;
}

export const api = {
  listProjects: (signal) => request('/projects', { signal }),
  getProject: (slug, signal) => request(`/projects/${encodeURIComponent(slug)}`, { signal }),
  sendContact: (payload) => request('/contact', { method: 'POST', body: payload }),
  subscribe: (payload) => request('/newsletter', { method: 'POST', body: payload }),
};
