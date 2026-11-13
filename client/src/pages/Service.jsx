import { Link, Navigate, useParams } from 'react-router-dom';
import Seo, { serviceLd } from '../components/Seo.jsx';
import Viz from '../components/Viz.jsx';
import Faq from '../components/Faq.jsx';
import ContactBlock from '../components/ContactBlock.jsx';
import { bySlug, PRICING } from '../data/services.js';

export default function Service() {
  const { slug } = useParams();
  const s = bySlug(slug);

  if (!s) return <Navigate to="/" replace />;

  // Keep the detail page resilient if a service record is missing an optional list.
  const included = Array.isArray(s.included) ? s.included : [];
  const processSteps = Array.isArray(s.process) ? s.process : [];
  const faqItems = Array.isArray(s.faq) ? s.faq : [];
  const spot = s.spotlight && typeof s.spotlight === 'object' ? s.spotlight : null;
  const spotStages = Array.isArray(spot?.stages) ? spot.stages : [];
  const spotOutcomes = Array.isArray(spot?.outcomes) ? spot.outcomes : [];
  const pricing = Array.isArray(PRICING) ? PRICING.find((p) => p.slug === s.slug) : null;
  const pricingTiers = Array.isArray(pricing?.tiers) ? pricing.tiers : [];

  return (
    <div className="shell" style={{ '--c': s.accent }}>
      <Seo title={s.long} description={s.short} ld={serviceLd(s)} />

      <section className="page-hero split" style={{ alignItems: 'center' }}>
        <div>
          <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / {s.long}</p>
          <span className="eyebrow" style={{ marginTop: 18 }}>Service</span>
          <h1>{s.long}</h1>
          <p className="lead">{s.short}</p>
          <div className="row">
            <Link className="btn" to={`/contact?service=${s.slug}`}>Ask about this</Link>
            <Link className="btn ghost" to="/pricing">See pricing</Link>
          </div>
        </div>
        <Viz kind={s.viz} big />
      </section>

      <section className="sec split">
        <div>
          <span className="eyebrow">Who it's for</span>
          <h2>Built for people like this.</h2>
          <p className="lead">{s.forWho}</p>
          {s.timeline ? <p className="mono muted" style={{ fontSize: '0.85rem' }}>Typical timeline: {s.timeline}</p> : null}
        </div>
        <div>
          <span className="eyebrow">What's included</span>
          {included.length ? (
            <ul className="checks" style={{ marginTop: 18 }}>
              {included.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
            </ul>
          ) : <p className="muted">Details for this service are being updated.</p>}
        </div>
      </section>

      {spot ? (
        <section className="sec" aria-labelledby="how-pipe">
          <div className="sec-head">
            <span className="eyebrow">How a pipeline flows</span>
            <h2 id="how-pipe">From source to dashboard.</h2>
            {spot.what ? <p>{spot.what}</p> : null}
          </div>
          {spotStages.length ? (
            <ul className="stages" style={{ marginTop: 0 }}>
              {spotStages.map((stage, index) => {
                const [name, description] = Array.isArray(stage) ? stage : [stage?.name || `Stage ${index + 1}`, stage?.description || ''];
                return <li key={`${index}-${name}`}><b>{name}</b><span>{description}</span></li>;
              })}
            </ul>
          ) : null}
          <div className="split" style={{ marginTop: 28 }}>
            <div className="panel">
              <h3>Typical stack</h3>
              <p>We stay tool-agnostic and work with what you already run. Common setups:</p>
              <div className="chips" style={{ marginTop: 0 }}>
                {['Airflow', 'Prefect', 'Dagster', 'cron', 'dbt', 'Python', 'SQL', 'Postgres', 'BigQuery', 'Snowflake', 'Metabase', 'Looker', 'Power BI'].map((tool) => <span className="chip" key={tool}>{tool}</span>)}
              </div>
            </div>
            <div className="panel">
              <h3>What you get</h3>
              {spotOutcomes.length ? <ul className="checks">{spotOutcomes.map((outcome, index) => <li key={`${index}-${outcome}`}>{outcome}</li>)}</ul> : <p className="muted">Outcomes will be confirmed in the project scope.</p>}
            </div>
          </div>
        </section>
      ) : null}

      {processSteps.length ? (
        <section className="sec" aria-labelledby="proc">
          <div className="sec-head">
            <span className="eyebrow">Process</span>
            <h2 id="proc">How it goes.</h2>
          </div>
          <ol className="steps">
            {processSteps.map((step, index) => {
              const [title, description] = Array.isArray(step) ? step : [step?.title || `Step ${index + 1}`, step?.description || ''];
              return <li key={`${index}-${title}`}><b>{title}</b><span>{description}</span></li>;
            })}
          </ol>
        </section>
      ) : null}

      {pricingTiers.length ? (
        <section className="sec" aria-labelledby="plans">
          <div className="sec-head">
            <span className="eyebrow">{spot ? 'Plans' : 'Packages'}</span>
            <h2 id="plans">{spot ? 'Pick how much help you want.' : 'Packages.'}</h2>
          </div>
          <div className="tiers">
            {pricingTiers.map((tier) => {
              const items = Array.isArray(tier.items) ? tier.items : [];
              return (
                <div className="tier" key={tier.name} style={{ '--c': pricing.accent }}>
                  <h4>{tier.name}</h4>
                  <div className="price">{tier.price}</div>
                  <div className="note">{tier.note}</div>
                  {items.length ? <ul>{items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul> : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="sec" aria-labelledby="sfaq">
        <div className="sec-head">
          <span className="eyebrow">Questions</span>
          <h2 id="sfaq">Common questions.</h2>
        </div>
        {faqItems.length ? <Faq items={faqItems} /> : <p className="muted">Contact us if you have questions about this service.</p>}
      </section>

      <ContactBlock />
    </div>
  );
}
