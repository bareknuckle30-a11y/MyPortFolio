import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import SprayHero from '../components/SprayHero.jsx';
import { ServiceCard, WorkCard } from '../components/Cards.jsx';
import Faq from '../components/Faq.jsx';
import ContactBlock from '../components/ContactBlock.jsx';
import { SERVICES } from '../data/services.js';
import { PHASES, HOME_FAQ } from '../data/site.js';
import BusinessSolutions from '../components/BusinessSolutions.jsx';
import { useProjects } from '../hooks/useProjects.js';

function Toast({ ok }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="toast" role="status" style={ok ? undefined : { color: 'var(--bad)', borderColor: 'rgba(255,122,144,.5)' }}>
      {ok ? 'You are subscribed. Thanks!' : 'That confirmation link did not work. Please subscribe again.'}
    </div>
  );
}

export default function Home() {
  const [params] = useSearchParams();
  const subscribed = params.get('subscribed');
  const { projects, loading } = useProjects();

  return (
    <>
      <Seo
        description="Webhead builds personal portfolios, business websites, e-commerce stores, task management apps, chat apps and EdTech platforms for individuals and growing businesses."
      />
      {subscribed === '1' || subscribed === '0' ? <Toast ok={subscribed === '1'} /> : null}

      <div className="shell">
        <SprayHero />
        <div className="hero-copy">
          <div>
            <span className="eyebrow">Personal portfolio · Digital solutions</span>
            <h1>Ideas into useful digital experiences.</h1>
          </div>
          <div>
            <p className="lead">From personal portfolios and business websites to online stores and custom applications, we build practical digital products around your goals.</p>
            <div className="row">
              <Link className="btn" to="/work">See the work</Link>
              <Link className="btn ghost" to="/contact">Start a project</Link>
            </div>
          </div>
        </div>

        <section className="sec" id="services" aria-labelledby="services-title">
          <div className="sec-head">
            <span className="eyebrow">What we do</span>
            <h2 id="services-title">Digital solutions for people and businesses.</h2>
            <p>Explore the kind of websites and applications we can design, build and support.</p>
          </div>
          <div className="cards four">
            {SERVICES.map((s) => (
              <ServiceCard key={s.slug} viz={s.viz} accent={s.accent} title={s.title} text={s.short} points={s.points} to={`/services/${s.slug}`} />
            ))}
          </div>
        </section>

        <section className="sec how" id="how" aria-labelledby="how-title">
          <div className="sec-head">
            <span className="eyebrow">How we work</span>
            <h2 id="how-title">Three phases, in order.</h2>
            <p>Every project moves through the same loop, so you always know what is happening and why.</p>
          </div>
          <div className="cards">
            {PHASES.map((p) => (
              <ServiceCard key={p.key} viz={p.key} accent={p.accent} title={p.title} text={p.desc} points={p.items} />
            ))}
          </div>
        </section>

        <BusinessSolutions />

        <section className="sec" id="work" aria-labelledby="work-title">
          <div className="sec-head">
            <span className="eyebrow">Selected work</span>
            <h2 id="work-title">Projects we put our tag on.</h2>
          </div>
          {loading ? <p className="muted" role="status">Loading projects…</p> : (
            <div className="work">{projects.slice(0, 3).map((p) => <WorkCard key={p.slug || p.title} project={p} />)}</div>
          )}
          <p style={{ marginTop: 22 }}><Link className="btn ghost sm" to="/work">All projects</Link></p>
        </section>

        <section className="sec" aria-labelledby="approach-title">
          <div className="sec-head">
            <span className="eyebrow">Flexible engagement</span>
            <h2 id="approach-title">Start with a package. Make it your own.</h2>
            <p>Choose a clear starting point or work with us on a fully custom build. Scope and pricing are agreed before development begins.</p>
          </div>
          <div className="cards">
            <article className="card" style={{ '--c': '#b36bff' }}>
              <h3>Ready-to-customise</h3>
              <p>A proven starting structure for common needs, adapted to your brand, content and workflow.</p>
              <ul><li>Faster project discovery</li><li>Defined feature starting point</li><li>Custom branding and content</li></ul>
              <Link className="more" to="/contact">Ask about a starter package</Link>
            </article>
            <article className="card" style={{ '--c': '#f4f2fa' }}>
              <h3>Custom development</h3>
              <p>Purpose-built websites and applications when your requirements need a tailored solution.</p>
              <ul><li>Requirements-led planning</li><li>Custom features and integrations</li><li>Milestone-based delivery</li></ul>
              <Link className="more" to="/contact">Discuss a custom project</Link>
            </article>
            <article className="card" style={{ '--c': '#ff4fd8' }}>
              <h3>Launch & support</h3>
              <p>Get help with deployment, handover, maintenance and improvements after launch.</p>
              <ul><li>Deployment and handover</li><li>Maintenance options</li><li>Ongoing improvements</li></ul>
              <Link className="more" to="/contact">Plan post-launch support</Link>
            </article>
          </div>
        </section>

        <section className="sec" aria-labelledby="faq-title">
          <div className="sec-head">
            <span className="eyebrow">Questions</span>
            <h2 id="faq-title">Before you get in touch.</h2>
          </div>
          <Faq items={HOME_FAQ} />
        </section>

        <ContactBlock />
      </div>
    </>
  );
}
