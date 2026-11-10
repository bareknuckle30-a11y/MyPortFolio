import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Faq from '../components/Faq.jsx';
import ContactBlock from '../components/ContactBlock.jsx';
import { PRICING } from '../data/services.js';

const PRICING_FAQ = [
  ['Are these fixed prices?', 'The packages are starting scopes, not fixed prices. We confirm the pages, features, integrations, content and support requirements before sending a written quotation.'],
  ['What currency and taxes apply?', 'The quotation will state the agreed currency and any applicable taxes or third-party charges before work begins.'],
  ['How do payments work?', 'Payment milestones are agreed in the written proposal and depend on the project scope. No work begins until the scope and payment terms are clear.'],
  ['Can the scope change after work starts?', 'Yes. If new requirements come up, we explain the impact on cost and timeline and agree the change before proceeding.'],
];

export default function Pricing() {
  return (
    <div className="shell">
      <Seo title="Packages & custom quotes" description="Explore starting scopes for portfolios, websites, e-commerce, task management, chat applications, EdTech and custom business tools." />
      <section className="page-hero">
        <span className="eyebrow">Ways to work together</span>
        <h1>A clear starting point. A solution shaped around you.</h1>
        <p className="lead">Explore common project scopes for individuals, local businesses, education providers and startups. We confirm the requirements and provide a custom quotation before development begins.</p>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        {PRICING.map((block) => (
          <div className="price-block" key={block.slug}>
            <h2>{block.title}</h2>
            <div className="tiers">
              {block.tiers.map((t) => (
                <div className="tier" key={t.name} style={{ '--c': block.accent }}>
                  <h4>{t.name}</h4>
                  <div className="price">{t.price}</div>
                  <div className="note">{t.note}</div>
                  <ul>{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  <Link className="btn ghost sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} to={`/contact?service=${block.slug}`}>Ask about {t.name}</Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="sec" aria-labelledby="pf">
        <div className="sec-head"><span className="eyebrow">Questions</span><h2 id="pf">About pricing.</h2></div>
        <Faq items={PRICING_FAQ} />
      </section>
      <ContactBlock />
    </div>
  );
}
