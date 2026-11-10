import Seo from '../components/Seo.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Newsletter from '../components/Newsletter.jsx';
import CopyEmail from '../components/CopyEmail.jsx';
import { SITE } from '../data/site.js';

export default function Contact() {
  return (
    <div className="shell">
      <Seo title="Contact" description="Tell Webhead Solutions about your project. We reply within one business day." />
      <section className="page-hero">
        <span className="eyebrow">Contact</span>
        <h1>Tell us what you're building.</h1>
        <p className="lead">A few details are enough to start. We reply within {SITE.responseTime}.</p>
      </section>

      <section className="sec contact-grid" style={{ paddingTop: 28 }}>
        <div className="panel"><ContactForm /></div>
        <div className="form" style={{ gap: 18 }}>
          <div className="panel">
            <h3>Prefer email?</h3>
            <p>Write to us directly.</p>
            <CopyEmail />
          </div>
          {SITE.booking ? (
            <div className="panel">
              <h3>Book a call</h3>
              <p>Pick a time that suits you.</p>
              <a className="btn" href={SITE.booking} target="_blank" rel="noopener noreferrer">Open the calendar</a>
            </div>
          ) : null}
          <div className="panel">
            <h3>Stay in the loop</h3>
            <p>Occasional notes on what we are building and learning. No spam.</p>
            <Newsletter compact />
          </div>
        </div>
      </section>
    </div>
  );
}
