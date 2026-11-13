
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { submitInstagramAudit, ApiError } from '../lib/instagramAuditApi.js';

const INITIAL = {
  instagramUrl: '', businessType: 'local-business', primaryGoal: 'get-leads',
  postingFrequency: 'weekly', hasWebsite: 'no', bioClarity: 'unsure',
  contentChallenge: 'consistency', name: '', email: '', businessName: '',
  consent: false, hp: '',
};

const QUESTIONS = [
  { key: 'businessType', label: 'What best describes your account?', options: [['creator','Creator'],['local-business','Local business'],['professional-service','Professional service'],['ecommerce','E-commerce / product brand'],['other','Other']] },
  { key: 'primaryGoal', label: 'What is your main Instagram goal?', options: [['grow-audience','Grow an audience'],['get-leads','Generate enquiries / leads'],['sell-products','Sell products'],['build-credibility','Build credibility'],['portfolio','Showcase my work / portfolio']] },
  { key: 'postingFrequency', label: 'How often do you currently post?', options: [['daily','Daily'],['few-week','A few times a week'],['weekly','About once a week'],['rarely','Rarely'],['unknown','Not sure']] },
  { key: 'hasWebsite', label: 'Do you have a website?', options: [['yes','Yes'],['no','No'],['planning','Planning one']] },
  { key: 'bioClarity', label: 'Does your bio clearly explain what you offer?', options: [['clear','Yes, clearly'],['somewhat','Somewhat'],['unclear','No'],['unsure','Not sure']] },
  { key: 'contentChallenge', label: 'What is your biggest content challenge?', options: [['consistency','Staying consistent'],['ideas','Coming up with ideas'],['design','Visual design and branding'],['reach','Getting reach'],['conversions','Turning visitors into customers'],['not-sure','Not sure yet']] },
];

function Field({ label, children, error }) {
  return <div className={`audit-field${error ? ' invalid' : ''}`}><label>{label}</label>{children}{error ? <small role="alert">{error}</small> : null}</div>;
}

export default function InstagramAudit() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [failure, setFailure] = useState('');
  const [report, setReport] = useState(null);

  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validateStepOne() {
    const next = {};
    try {
      const url = new URL(values.instagramUrl);
      if (!['instagram.com','www.instagram.com'].includes(url.hostname.toLowerCase()) || !/^\/[a-zA-Z0-9._]{1,30}\/?$/.test(url.pathname)) next.instagramUrl = 'Enter a valid Instagram profile URL.';
    } catch { next.instagramUrl = 'Enter a valid Instagram profile URL.'; }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const next = {};
    if (!values.name.trim()) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Enter a valid email.';
    if (!values.consent) next.consent = 'Please agree to be contacted about this audit.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus('sending'); setFailure('');
    try {
      const result = await submitInstagramAudit({ ...values, name: values.name.trim(), email: values.email.trim() });
      setReport(result.report);
      setStatus('done');
    } catch (error) {
      setFailure(error instanceof ApiError ? error.message : 'Could not submit the audit. Please try again.');
      if (error instanceof ApiError && error.fields) setErrors(error.fields);
      setStatus('failed');
    }
  }

  return (
    <div className="shell">
      <Seo title="Free Instagram Audit" description="Get a practical Instagram profile review and find the Webhead service that best fits your business goals." />
      <section className="page-hero audit-hero">
        <span className="eyebrow">Free Instagram audit</span>
        <h1>Find out what your Instagram needs next.</h1>
        <p className="lead">Answer a few quick questions about your account. Get a practical action plan and a Webhead service recommendation based on your goals.</p>
        <div className="audit-trust"><span>01 / Profile basics</span><span>02 / Your goals</span><span>03 / Action plan</span></div>
      </section>

      {!report ? (
        <section className="audit-wrap">
          <div className="audit-panel">
            <div className="audit-progress"><span style={{ width: step === 1 ? '52%' : '100%' }} /></div>
            <div className="audit-step-head">
              <span className="eyebrow">Step {step} of 2</span>
              <h2>{step === 1 ? 'Tell us about your Instagram' : 'Where should we send your report?'}</h2>
              <p className="muted">{step === 1 ? 'We use these answers to tailor your preliminary assessment.' : 'Your details are used to save your report and contact you about the recommendations.'}</p>
            </div>
            {step === 1 ? (
              <form className="audit-form" onSubmit={(e) => { e.preventDefault(); if (validateStepOne()) setStep(2); }}>
                <Field label="Instagram profile URL" error={errors.instagramUrl}>
                  <input className="input" type="url" placeholder="https://www.instagram.com/yourusername/" value={values.instagramUrl} onChange={update('instagramUrl')} />
                </Field>
                <div className="audit-question-grid">
                  {QUESTIONS.map((q) => <Field key={q.key} label={q.label}><select className="select" value={values[q.key]} onChange={update(q.key)}>{q.options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></Field>)}
                </div>
                <div className="row audit-actions"><button className="btn" type="submit">Continue to unlock report <span aria-hidden="true">→</span></button></div>
                <p className="audit-note">This first version uses the information you provide. It does not sign in to Instagram or access private account insights.</p>
              </form>
            ) : (
              <form className="audit-form" onSubmit={submit}>
                <div className="audit-question-grid">
                  <Field label="Your name" error={errors.name}><input className="input" autoComplete="name" value={values.name} onChange={update('name')} /></Field>
                  <Field label="Business email" error={errors.email}><input className="input" type="email" autoComplete="email" value={values.email} onChange={update('email')} /></Field>
                </div>
                <Field label="Business / brand name (optional)"><input className="input" value={values.businessName} onChange={update('businessName')} placeholder="Your brand name" /></Field>
                <div className="audit-consent">
                  <label><input type="checkbox" checked={values.consent} onChange={update('consent')} /> I agree that Webhead may contact me about this Instagram audit and relevant services. I have read the <Link to="/privacy">Privacy Policy</Link>.</label>
                  {errors.consent ? <small role="alert">{errors.consent}</small> : null}
                </div>
                <div className="hp" aria-hidden="true"><label htmlFor="audit-hp">Leave empty</label><input id="audit-hp" tabIndex="-1" autoComplete="off" value={values.hp} onChange={update('hp')} /></div>
                {status === 'failed' ? <div className="notice bad" role="alert">{failure}</div> : null}
                <div className="row audit-actions">
                  <button className="btn ghost" type="button" onClick={() => setStep(1)}>Back</button>
                  <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Preparing your report…' : 'Unlock my free report'}</button>
                </div>
                <p className="audit-note">No Instagram password is requested. You can ask us to delete your submitted audit details.</p>
              </form>
            )}
          </div>
          <aside className="audit-side">
            <span className="eyebrow">What you'll get</span>
            <h3>A useful next step, not just a score.</h3>
            <ul><li>Profile and positioning observations</li><li>Content consistency and goal alignment</li><li>Prioritised actions to work on</li><li>A Webhead service recommendation with a reason</li></ul>
            <div className="audit-side-callout"><strong>Transparent by design</strong><p>Scores are based on your answers, not hidden Instagram metrics. A full visual review can be done separately using screenshots you choose to share.</p></div>
          </aside>
        </section>
      ) : (
        <section className="audit-result">
          <div className="audit-result-head">
            <span className="eyebrow">Your preliminary audit</span>
            <h2>Here's where to focus next.</h2>
            <p className="muted">For {values.instagramUrl}</p>
          </div>
          <div className="audit-score-panel">
            <div><span className="audit-score">{report.score}</span><span className="audit-outof">/100</span></div>
            <div><strong>{report.scoreLabel}</strong><p>{report.basis}</p></div>
          </div>
          <div className="audit-result-grid">
            <article className="panel"><h3>What we noticed</h3><ul>{report.findings.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="panel"><h3>Recommended actions</h3><ol>{report.actions.map((item) => <li key={item}>{item}</li>)}</ol></article>
          </div>
          <article className="audit-recommendation">
            <span className="eyebrow">Recommended Webhead service</span>
            <h2>{report.recommendedService.name}</h2>
            <p>{report.recommendedService.reason}</p>
            <div className="row">
              <Link className="btn" to={`/contact?service=${report.recommendedService.slug}&brief=${encodeURIComponent(`Instagram audit for ${values.instagramUrl}. Recommended service: ${report.recommendedService.name}.`)}`}>Discuss this recommendation</Link>
              <button className="btn ghost" type="button" onClick={() => window.print()}>Print / Save report</button>
            </div>
          </article>
          <p className="audit-note">This is a preliminary, self-reported assessment, not an official Instagram performance report. For a visual profile review, share screenshots during a consultation.</p>
          <button className="btn ghost sm" type="button" onClick={() => { setReport(null); setStep(1); setStatus('idle'); setValues(INITIAL); }}>Run another audit</button>
        </section>
      )}
    </div>
  );
}
