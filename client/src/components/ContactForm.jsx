import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../lib/api.js';
import { contactSchema, fieldErrors } from '../lib/schemas.js';
import { SERVICE_OPTIONS, BUDGET_OPTIONS, SITE } from '../data/site.js';

const EMPTY = { name: '', email: '', service: '', budget: '', message: '', hp: '' };

function Field({ id, label, optional, error, children }) {
  return (
    <div className={`field${error ? ' invalid' : ''}`}>
      <label htmlFor={id}>{label}{optional ? <span className="opt"> (optional)</span> : null}</label>
      {children}
      <span className="err" id={`${id}-err`} role={error ? 'alert' : undefined}>{error || ''}</span>
    </div>
  );
}

export default function ContactForm() {
  const [params] = useSearchParams();
  const preset = SERVICE_OPTIONS.some((o) => o.value === params.get('service')) ? params.get('service') : '';
  const initialBrief = params.get('brief') || '';
  const [values, setValues] = useState({ ...EMPTY, service: preset, message: initialBrief.slice(0, 5000) });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | done | failed
  const [failure, setFailure] = useState('');

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };
  const aria = (key) => ({ 'aria-invalid': Boolean(errors[key]), 'aria-describedby': `c-${key}-err` });

  async function onSubmit(e) {
    e.preventDefault();
    if (state === 'sending') return;
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fe = fieldErrors(parsed.error);
      setErrors(fe);
      setState('idle');
      const first = Object.keys(fe)[0];
      document.getElementById(`c-${first}`)?.focus();
      return;
    }
    setErrors({});
    setFailure('');
    setState('sending');
    const payload = { ...parsed.data };
    if (!payload.budget) delete payload.budget;
    try {
      await api.sendContact(payload);
      setState('done');
      setValues({ ...EMPTY });
    } catch (err) {
      // Input is kept so nothing is lost; field errors from the server are shown under the fields.
      if (err instanceof ApiError && err.fields && Object.keys(err.fields).length) setErrors(err.fields);
      setFailure(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setState('failed');
    }
  }

  if (state === 'done') {
    return (
      <div className="notice ok" role="status">
        <strong>Message sent.</strong>
        <p style={{ margin: '6px 0 0', color: 'var(--ink)' }}>
          Thanks. We will reply within {SITE.responseTime}. If you do not see our email, check your spam folder.
        </p>
        <button className="btn ghost sm" type="button" style={{ marginTop: 14 }} onClick={() => setState('idle')}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Contact form">
      <div className="two">
        <Field id="c-name" label="Your name" error={errors.name}>
          <input id="c-name" className="input" autoComplete="name" value={values.name} onChange={set('name')} {...aria('name')} />
        </Field>
        <Field id="c-email" label="Email" error={errors.email}>
          <input id="c-email" className="input" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set('email')} {...aria('email')} />
        </Field>
      </div>
      <div className="two">
        <Field id="c-service" label="What do you need?" error={errors.service}>
          <select id="c-service" className="select" value={values.service} onChange={set('service')} {...aria('service')}>
            <option value="" disabled>Choose a service</option>
            {SERVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field id="c-budget" label="Budget" optional error={errors.budget}>
          <select id="c-budget" className="select" value={values.budget} onChange={set('budget')} {...aria('budget')}>
            <option value="">Prefer not to say</option>
            {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>
      <Field id="c-message" label="Tell us about the project" error={errors.message}>
        <textarea id="c-message" className="textarea" value={values.message} onChange={set('message')} {...aria('message')} />
      </Field>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="c-hp">Leave this field empty</label>
        <input id="c-hp" tabIndex={-1} autoComplete="off" value={values.hp} onChange={set('hp')} />
      </div>

      <div aria-live="polite">
        {state === 'failed' ? <div className="notice bad" role="alert">{failure}</div> : null}
      </div>
      <div className="row">
        <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
        <span className="muted" style={{ fontSize: '0.88rem' }}>We only use your details to reply to you.</span>
      </div>
    </form>
  );
}
