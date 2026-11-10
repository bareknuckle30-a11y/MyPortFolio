import { Link, Navigate, useParams } from 'react-router-dom';
import Seo, { serviceLd } from '../components/Seo.jsx';
import Viz from '../components/Viz.jsx';
import Faq from '../components/Faq.jsx';
import ContactBlock from '../components/ContactBlock.jsx';
import { bySlug, PRICING } from '../data/services.js';

export default function Service() {
  const { slug } = useParams();
  const s = bySlug(slug);
  if (!s) return <Navigate to="/404" replace />;
  const pricing = PRICING.find((p) => p.slug === s.slug);
  const spot = s.spotlight;

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
          <ul className="checks" style={{ marginTop: 18 }}>
            {s.included.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
      </section>

      {spot ? (
        <section className="sec" aria-labelledby="how-pipe">
          <div className="sec-head">
            <span className="eyebrow">How a pipeline flows</span>
            <h2 id="how-pipe">From source to dashboard.</h2>
            <p>{spot.what}</p>
          </div>
          <ul className="stages" style={{ marginTop: 0 }}>
            {spot.stages.map(([n, d]) => <li key={n}><b>{n}</b><span>{d}</span></li>)}
          </ul>
          <div className="split" style={{ marginTop: 28 }}>
            <div className="panel">
              <h3>Typical stack</h3>
              <p>We stay tool-agnostic and work with what you already run. Common setups:</p>
              <div className="chips" style={{ marginTop: 0 }}>
                {['Airflow', 'Prefect', 'Dagster', 'cron', 'dbt', 'Python', 'SQL', 'Postgres', 'BigQuery', 'Snowflake', 'Metabase', 'Looker', 'Power BI'].map((t) => <span className="chip" key={t}>{t}</span>)}
              </div>
            </div>
            <div className="panel">
              <h3>What you get</h3>
              <ul className="checks">{spot.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="sec" aria-labelledby="proc">
        <div className="sec-head">
          <span className="eyebrow">Process</span>
          <h2 id="proc">How it goes.</h2>
        </div>
        <ol className="steps">
          {s.process.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
        </ol>
      </section>

      {pricing ? (
        <section className="sec" aria-labelledby="plans">
          <div className="sec-head">
            <span className="eyebrow">{spot ? 'Plans' : 'Packages'}</span>
            <h2 id="plans">{spot ? 'Pick how much help you want.' : 'Packages.'}</h2>
          </div>
          <div className="tiers">
            {pricing.tiers.map((t) => (
              <div className="tier" key={t.name} style={{ '--c': pricing.accent }}>
                <h4>{t.name}</h4>
                <div className="price">{t.price}</div>
                <div className="note">{t.note}</div>
                <ul>{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="sec" aria-labelledby="sfaq">
        <div className="sec-head">
          <span className="eyebrow">Questions</span>
          <h2 id="sfaq">Common questions.</h2>
        </div>
        <Faq items={s.faq} />
      </section>

      <ContactBlock />
    </div>
  );
}
