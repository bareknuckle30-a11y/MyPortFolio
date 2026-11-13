// Standalone API helper for the Instagram audit page.
// Uses the same VITE_API_URL convention as the existing project API.
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status, code, fields } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields || {};
  }
}

export async function submitInstagramAudit(payload) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api/instagram-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', { code: 'network' });
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data?.error || {};
    throw new ApiError(error.message || 'Something went wrong. Please try again.', {
      status: response.status,
      code: error.code,
      fields: error.fields,
    });
  }
  return data;
}
