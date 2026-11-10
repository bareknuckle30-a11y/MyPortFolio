import { useState } from 'react';
import { api, ApiError } from '../lib/api.js';
import { newsletterSchema, fieldErrors } from '../lib/schemas.js';

export default function Newsletter({ compact = false }) {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | failed
  const [message, setMessage] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (state === 'sending') return;
    const parsed = newsletterSchema.safeParse({ email, hp });
    if (!parsed.success) {
      setError(fieldErrors(parsed.error).email || 'Check your email address');
      return;
    }
    setError('');
    setState('sending');
    try {
      const res = await api.subscribe(parsed.data);
      setMessage(res?.message || 'Check your inbox for a confirmation link.');
      setState('done');
      setEmail('');
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setState('failed');
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Newsletter signup">
      {!compact && <h3 style={{ margin: 0 }}>Get occasional updates</h3>}
      <div className="news">
        <label className="hp" htmlFor={compact ? 'nl-hp-f' : 'nl-hp'} aria-hidden="true">Leave this empty
          <input id={compact ? 'nl-hp-f' : 'nl-hp'} tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
        <input
          id={compact ? 'nl-email-f' : 'nl-email'}
          className="input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'nl-err' : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Subscribe'}</button>
      </div>
      <div aria-live="polite">
        {error ? <p id="nl-err" className="err" style={{ margin: 0 }}>{error}</p> : null}
        {state === 'done' ? <p className="muted" style={{ margin: 0, color: 'var(--ok)' }}>{message}</p> : null}
        {state === 'failed' ? <p className="err" style={{ margin: 0 }}>{message}</p> : null}
      </div>
    </form>
  );
}
