
import { useMemo, useState } from 'react';
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

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'A focused starting point',
    description: 'For individuals and businesses getting started.',
    aliases: ['starter', 'basic', 'launch'],
  },
  {
    id: 'standard',
    name: 'Standard',
    subtitle: 'More room to grow',
    description: 'For growing businesses that need more functionality.',
    aliases: ['standard', 'growth', 'professional'],
  },
  {
    id: 'custom',
    name: 'Custom',
    subtitle: 'Built around your requirements',
    description: 'For complex projects, integrations and tailored workflows.',
    aliases: ['custom', 'enterprise', 'tailored'],
  },
];

function findMatchingTier(block, plan) {
  const tiers = Array.isArray(block?.tiers) ? block.tiers : [];

  return tiers.find((tier) => {
    const name = String(tier?.name || '').toLowerCase().trim();
    return plan.aliases.some((alias) => name.includes(alias));
  }) || null;
}

export default function Pricing() {
  const pricingBlocks = Array.isArray(PRICING) ? PRICING : [];

  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [selectedServices, setSelectedServices] = useState([]);

  const activePlan = PLANS.find((plan) => plan.id === selectedPlan) || PLANS[0];

  const selectedPackages = useMemo(() => {
    return pricingBlocks
      .filter((block) => selectedServices.includes(block?.slug))
      .map((block) => ({
        block,
        tier: findMatchingTier(block, activePlan),
      }));
  }, [pricingBlocks, selectedServices, activePlan]);

  const includedFeatures = useMemo(() => {
    const features = selectedPackages.flatMap(({ tier }) =>
      Array.isArray(tier?.items) ? tier.items : []
    );

    return [...new Set(features.filter(Boolean))];
  }, [selectedPackages]);

  const quoteLabel = useMemo(() => {
    if (selectedPlan === 'custom') return 'Custom quotation';
    if (selectedPackages.length === 1 && selectedPackages[0].tier?.price) {
      return selectedPackages[0].tier.price;
    }
    return 'Based on selected services';
  }, [selectedPlan, selectedPackages]);

  const contactQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set('plan', activePlan.name);
    params.set(
      'services',
      selectedPackages.map(({ block }) => block.title || block.slug).join(', ')
    );
    return `/contact?${params.toString()}`;
  }, [activePlan, selectedPackages]);

  function toggleService(slug) {
    setSelectedServices((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  }

  return (
    <div className="shell pricing-page">
      <Seo
        title="Packages & custom quotes"
        description="Choose a Starter, Standard or Custom package and select the services your business needs. Get a tailored project quotation from Webhead."
      />

      <section className="page-hero pricing-hero">
        <span className="eyebrow">Flexible ways to work together</span>
        <h1>Choose your direction. We'll build the right solution.</h1>
        <p className="lead">
          Select a package, choose the services you need and create a starting
          scope for your project. We'll review your requirements and prepare
          a quotation.
        </p>
      </section>

      <section className="sec pricing-builder" aria-labelledby="pricing-builder-title">
        <div className="pricing-builder-heading">
          <div>
            <span className="eyebrow">Configure your project</span>
            <h2 id="pricing-builder-title">Build your package.</h2>
            <p className="muted">
              Your selections shape the scope of your enquiry.
            </p>
          </div>
          <span className="pricing-live-indicator">
            <span />
            LIVE CONFIGURATOR
          </span>
        </div>

        <div className="pricing-configurator">
          <div className="pricing-configurator-top">
            <span>01 / SELECT YOUR PLAN</span>
            <span>CHOOSE ONE</span>
          </div>

          <div className="pricing-plan-selector" role="group" aria-label="Choose a package">
            {PLANS.map((plan, index) => (
              <button
                type="button"
                key={plan.id}
                className={`pricing-plan-option ${selectedPlan === plan.id ? 'active' : ''}`}
                aria-pressed={selectedPlan === plan.id}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <span className="pricing-plan-index">0{index + 1}</span>
                <span className="pricing-plan-name">{plan.name}</span>
                <span className="pricing-plan-subtitle">{plan.subtitle}</span>
                <span className="pricing-plan-description">{plan.description}</span>
                <span className="pricing-plan-check">
                  {selectedPlan === plan.id ? 'SELECTED' : 'SELECT PLAN'}
                </span>
              </button>
            ))}
          </div>

          <div className="pricing-configurator-divider" />

          <div className="pricing-configurator-top">
            <span>02 / SELECT YOUR SERVICES</span>
            <span>{selectedServices.length} SELECTED</span>
          </div>

          {pricingBlocks.length > 0 ? (
            <div className="pricing-service-grid">
              {pricingBlocks.map((block, index) => {
                const slug = block?.slug;
                if (!slug) return null;

                const checked = selectedServices.includes(slug);

                return (
                  <label
                    className={`pricing-service-option ${checked ? 'selected' : ''}`}
                    key={slug}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(slug)}
                    />
                    <span className="pricing-service-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="pricing-service-name">
                      {block?.title || slug}
                    </span>
                    <span className="pricing-service-indicator">
                      {checked ? '−' : '+'}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="muted">Services are currently being updated.</p>
          )}

          <div className="pricing-configurator-divider" />

          <div className="pricing-summary">
            <div className="pricing-summary-main">
              <span className="eyebrow">03 / YOUR PROJECT SUMMARY</span>
              <h3>{activePlan.name} package</h3>
              <p>{activePlan.description}</p>

              {selectedServices.length > 0 ? (
                <div className="pricing-selected-tags">
                  {selectedPackages.map(({ block }) => (
                    <span className="pricing-selected-tag" key={block.slug}>
                      {block.title || block.slug}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="pricing-empty-message">
                  Select at least one service to build your project summary.
                </p>
              )}
            </div>

            <div className="pricing-summary-quote">
              <span>ESTIMATED PACKAGE</span>
              <strong>{quoteLabel}</strong>
              <small>
                {selectedPlan === 'custom'
                  ? 'Final scope and quotation after consultation'
                  : 'Final pricing confirmed after requirements review'}
              </small>
            </div>
          </div>

          {selectedServices.length > 0 && (
            <div className="pricing-inclusions">
              <h4>Scope preview</h4>

              {includedFeatures.length > 0 ? (
                <ul>
                  {includedFeatures.map((feature, index) => (
                    <li key={`${index}-${feature}`}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">
                  The detailed scope for this plan will be confirmed during
                  your consultation.
                </p>
              )}

              {selectedPackages.some(({ tier }) => !tier) && (
                <p className="pricing-data-note">
                  Some selected services do not yet have a matching{' '}
                  {activePlan.name} tier in the pricing data. Their scope
                  will be confirmed separately.
                </p>
              )}
            </div>
          )}

          <div className="pricing-configurator-footer">
            <span>
              {selectedServices.length} service
              {selectedServices.length === 1 ? '' : 's'} · {activePlan.name}
            </span>

            {selectedServices.length > 0 ? (
              <Link className="btn pricing-submit" to={contactQuery}>
                Continue to enquiry <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              <button className="btn pricing-submit" type="button" disabled>
                Select a service to continue
              </button>
            )}
          </div>
        </div>

        <p className="pricing-footnote">
          Package names are starting scopes, not fixed commitments. Final
          features, delivery timelines and pricing are confirmed in a written
          proposal.
        </p>
      </section>

      <section className="sec" aria-labelledby="pf">
        <div className="sec-head">
          <span className="eyebrow">Questions</span>
          <h2 id="pf">About pricing.</h2>
        </div>
        <Faq items={PRICING_FAQ} />
      </section>

      <ContactBlock />
    </div>
  );
}
