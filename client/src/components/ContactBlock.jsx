import { Link } from 'react-router-dom';
import CopyEmail from './CopyEmail.jsx';
import { SITE } from '../data/site.js';

export default function ContactBlock() {
  return (
    <section className="contact-block" aria-labelledby="cb-title">
      <span className="eyebrow">Contact</span>
      <h2 id="cb-title">Have something to build?</h2>
      <p>Tell us what you're working on. We reply within {SITE.responseTime}.</p>
      <div className="row" style={{ justifyContent: 'center', gap: 18 }}>
        <Link className="btn" to="/contact">Start a project</Link>
        {SITE.booking ? <a className="btn ghost" href={SITE.booking} target="_blank" rel="noopener noreferrer">Book a call</a> : null}
      </div>
      <div style={{ marginTop: 22 }}><CopyEmail /></div>
    </section>
  );
}
