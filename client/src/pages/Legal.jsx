import Seo from '../components/Seo.jsx';
import { SITE } from '../data/site.js';

// These are plain-language drafts to start from. They are not legal advice: have them reviewed
// for your jurisdiction (GDPR, CCPA, India DPDP Act, etc.) before launch.

function Draft() {
  return <p className="draft-note">Draft: review with a legal professional before launch and fill in every [PLACEHOLDER].</p>;
}

export function Privacy() {
  return (
    <div className="shell">
      <Seo title="Privacy Policy" description="How Webhead Solutions collects and uses personal information." />
      <section className="page-hero prose">
        <span className="eyebrow">Legal</span>
        <h1>Privacy policy</h1>
        <Draft />
        <p>Last updated: [PLACEHOLDER: date]</p>
        <h2>Who we are</h2>
        <p>{SITE.name}, operated by {SITE.owner}, {SITE.location}. Contact: {SITE.email}.</p>
        <h2>What we collect</h2>
        <ul>
          <li>Contact form: your name, email address, chosen service, budget range and message.</li>
          <li>Newsletter: your email address and whether you confirmed your subscription.</li>
          <li>Basic technical data your browser sends when you visit, such as IP address, used for security and rate limiting.</li>
          <li>[PLACEHOLDER: analytics data, if you add an analytics tool, and whether it uses cookies.]</li>
        </ul>
        <h2>How we use it</h2>
        <p>We use your details to reply to your enquiry, to send the newsletter if you subscribed, and to keep the site secure. We do not sell your information.</p>
        <h2>Who we share it with</h2>
        <p>We use these providers to run the site: Supabase (database hosting), Brevo (email delivery and mailing lists), [PLACEHOLDER: hosting provider] and [PLACEHOLDER: analytics provider]. They process data on our behalf.</p>
        <h2>How long we keep it</h2>
        <p>[PLACEHOLDER: for example, enquiries are kept for 24 months; newsletter addresses until you unsubscribe.]</p>
        <h2>Your rights</h2>
        <p>You can ask to see, correct or delete your personal information, or unsubscribe at any time, by emailing {SITE.email}. [PLACEHOLDER: add rights specific to your jurisdiction.]</p>
      </section>
    </div>
  );
}

export function Terms() {
  return (
    <div className="shell">
      <Seo title="Terms of Service" description="Terms for using the Webhead Solutions website and engaging our services." />
      <section className="page-hero prose">
        <span className="eyebrow">Legal</span>
        <h1>Terms of service</h1>
        <Draft />
        <p>Last updated: [PLACEHOLDER: date]</p>
        <h2>Using this website</h2>
        <p>This website describes our services. The information on it is general and may change. Nothing on it is a binding offer until we agree scope and price in writing.</p>
        <h2>Projects and services</h2>
        <p>Each project is covered by a written agreement that sets out scope, timeline, price and payment terms. [PLACEHOLDER: summarise ownership of deliverables, revisions, payment schedule and cancellation.]</p>
        <h2>Data pipeline maintenance</h2>
        <p>Managed plans are billed monthly and cover the work listed in the chosen plan. [PLACEHOLDER: response times, access requirements, notice period and what is out of scope.]</p>
        <h2>Liability</h2>
        <p>[PLACEHOLDER: limits of liability and warranties, reviewed for your jurisdiction.]</p>
        <h2>Governing law</h2>
        <p>[PLACEHOLDER: governing law and where disputes are handled.]</p>
        <h2>Contact</h2>
        <p>Questions about these terms: {SITE.email}.</p>
      </section>
    </div>
  );
}
