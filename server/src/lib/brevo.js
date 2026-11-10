import { config } from '../config.js';

const BASE = 'https://api.brevo.com/v3';

async function brevo(path, body) {
  if (!config.emailEnabled) throw new Error('Brevo is not configured (set BREVO_API_KEY and BREVO_SENDER_EMAIL)');
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'api-key': config.brevo.apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Brevo ${path} responded ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

/** Send a transactional email. `to` is [{ email, name? }]. */
export function sendEmail({ to, subject, html, text, replyTo }) {
  return brevo('/smtp/email', {
    sender: { email: config.brevo.senderEmail, name: config.brevo.senderName },
    to,
    subject,
    htmlContent: html,
    textContent: text,
    ...(replyTo ? { replyTo } : {}),
  });
}

/** Create or update a contact and put it on a list. No-ops (resolves) when the list ID is not configured. */
export async function addToList({ email, name, listId }) {
  if (!listId) return null;
  return brevo('/contacts', {
    email,
    attributes: name ? { FIRSTNAME: name.split(' ')[0], LASTNAME: name.split(' ').slice(1).join(' ') } : undefined,
    listIds: [listId],
    updateEnabled: true,
  });
}
