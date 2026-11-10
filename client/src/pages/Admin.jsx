import { useCallback, useEffect, useMemo, useState } from 'react';
import Seo from '../components/Seo.jsx';
import { supabase, supabaseConfigured } from '../lib/supabase.js';
import { toCsv, downloadCsv } from '../lib/csv.js';
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from '../data/site.js';

const STATUSES = ['new', 'replied', 'closed'];
const serviceLabel = (v) => SERVICE_OPTIONS.find((o) => o.value === v)?.label || v;
const budgetLabel = (v) => BUDGET_OPTIONS.find((o) => o.value === v)?.label || v || '';

function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError('Email or password is not right.');
    else onDone();
  }

  return (
    <form className="form panel login" onSubmit={submit}>
      <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Admin sign in</h1>
      <div className="field">
        <label htmlFor="a-email">Email</label>
        <input id="a-email" className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="a-pass">Password</label>
        <input id="a-pass" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error ? <div className="notice bad" role="alert">{error}</div> : null}
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}

function Dashboard({ email, onSignOut }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setError('');
    const { data, error: err } = await supabase
      .from('contact_submissions')
      .select('id, created_at, name, email, service, budget, message, status, source')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (err) setError('Could not load submissions. Is your email in the admins table?');
    else setRows(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error: err } = await supabase.from('contact_submissions').update({ status }).eq('id', id);
    if (err) {
      setRows(prev);
      setError('Could not update the status. Please try again.');
    }
  }

  const shown = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((r) => (filter === 'all' || r.status === filter) &&
      (!q || [r.name, r.email, r.message, serviceLabel(r.service)].some((v) => String(v || '').toLowerCase().includes(q))));
  }, [rows, query, filter]);

  function exportCsv() {
    const data = shown.map((r) => ({ ...r, service: serviceLabel(r.service), budget: budgetLabel(r.budget) }));
    const csv = toCsv(data, [
      { key: 'created_at', label: 'Received' }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
      { key: 'service', label: 'Service' }, { key: 'budget', label: 'Budget' }, { key: 'status', label: 'Status' }, { key: 'message', label: 'Message' },
    ]);
    downloadCsv(`enquiries-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  const counts = rows ? STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]) : [];

  return (
    <>
      <div className="admin-bar">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 style={{ fontSize: '2rem', margin: '8px 0 0' }}>Enquiries</h1>
          <p className="muted mono" style={{ margin: '6px 0 0', fontSize: '0.78rem' }}>Signed in as {email}</p>
        </div>
        <div className="row">
          <button className="btn ghost sm" type="button" onClick={load}>Refresh</button>
          <button className="btn ghost sm" type="button" onClick={exportCsv} disabled={!shown.length}>Export CSV</button>
          <button className="btn ghost sm" type="button" onClick={onSignOut}>Sign out</button>
        </div>
      </div>

      <div className="admin-bar">
        <input className="input" type="search" placeholder="Search name, email, message" aria-label="Search enquiries" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="row" role="group" aria-label="Filter by status">
          {['all', ...STATUSES].map((s) => (
            <button key={s} type="button" className={`btn sm ${filter === s ? '' : 'ghost'}`} aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s}{s !== 'all' && rows ? ` (${counts.find(([k]) => k === s)?.[1] ?? 0})` : ''}
            </button>
          ))}
        </div>
      </div>

      {error ? <div className="notice bad" role="alert" style={{ marginBottom: 14 }}>{error}</div> : null}
      {rows === null && !error ? <p className="muted" role="status">Loading…</p> : null}
      {rows ? (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Received</th><th>Name</th><th>Email</th><th>Service</th><th>Budget</th><th>Message</th><th>Status</th></tr></thead>
            <tbody>
              {shown.length === 0 ? <tr><td colSpan={7} className="muted">No enquiries match.</td></tr> : shown.map((r) => (
                <tr key={r.id}>
                  <td className="mono" style={{ whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{r.name}</td>
                  <td><a href={`mailto:${r.email}`} style={{ color: 'var(--purple-hi)' }}>{r.email}</a></td>
                  <td>{serviceLabel(r.service)}</td>
                  <td>{budgetLabel(r.budget) || <span className="muted">n/a</span>}</td>
                  <td className="msg">{r.message}</td>
                  <td>
                    <span className={`pill ${r.status}`} style={{ marginRight: 8 }}>{r.status}</span>
                    <select className="select sm" aria-label={`Change status for ${r.name}`} value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = signed out
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!supabaseConfigured) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setAllowed(null); return; }
    supabase.from('admins').select('email').limit(1).then(({ data, error }) => setAllowed(!error && data?.length > 0));
  }, [session]);

  const signOut = () => supabase.auth.signOut();

  return (
    <div className="shell page-hero">
      <Seo title="Admin" noindex />
      {!supabaseConfigured ? (
        <div className="notice bad">Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env.</div>
      ) : session === undefined ? (
        <p className="muted" role="status">Checking session…</p>
      ) : session === null ? (
        <Login onDone={() => {}} />
      ) : allowed === null ? (
        <p className="muted" role="status">Checking access…</p>
      ) : allowed === false ? (
        <div className="panel login">
          <h1 style={{ fontSize: '1.6rem', margin: '0 0 10px' }}>No access</h1>
          <p>{session.user.email} is not an admin. Add it to the admins table in Supabase, then sign in again.</p>
          <button className="btn ghost" type="button" onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <Dashboard email={session.user.email} onSignOut={signOut} />
      )}
    </div>
  );
}
