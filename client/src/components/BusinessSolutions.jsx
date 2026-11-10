import { useState } from 'react';
import { Link } from 'react-router-dom';
import Viz from './Viz.jsx';

const INDUSTRIES = [
  {
    key: 'retail', label: 'Retail & merchandise', viz: 'shop', accent: '#ff4fd8',
    intro: 'Bring a local shop online with a product catalogue customers can browse from anywhere.',
    examples: 'Clothing, gifts, cosmetics, electronics and merchandise stores',
    service: 'ecommerce',
    features: ['Product catalogue and variants', 'Stock and order management', 'WhatsApp enquiries and ordering', 'Optional online payments'],
    brief: 'I run a retail or merchandise shop and need an online store. Please discuss product catalogue, variants, inventory, ordering and payment options.'
  },
  {
    key: 'kitchen', label: 'Cloud kitchens & restaurants', viz: 'shop', accent: '#b36bff',
    intro: 'Make your menu easy to explore and let customers place orders without calling for every detail.',
    examples: 'Cloud kitchens, takeaway counters, cafés and small restaurants',
    service: 'ecommerce',
    features: ['Digital menu and food categories', 'Add-ons and customisations', 'Pickup and delivery preferences', 'Order status and notifications'],
    brief: 'I run a cloud kitchen or restaurant and need a food ordering website. Please discuss digital menu, item customisation, pickup/delivery and order management.'
  },
  {
    key: 'bakery', label: 'Bakeries & home bakers', viz: 'portfolios', accent: '#f4f2fa',
    intro: 'Showcase your cakes and treats, collect custom orders and organise occasion-based requests.',
    examples: 'Bakeries, cake studios, pastry shops and home bakers',
    service: 'ecommerce',
    features: ['Cake and product gallery', 'Custom cake request form', 'Occasion and delivery-date selection', 'Order details and WhatsApp follow-up'],
    brief: 'I run a bakery or cake business and need a website for products and custom orders. Please discuss cake catalogue, customisation, occasions and delivery scheduling.'
  },
  {
    key: 'salon', label: 'Salons & beauty studios', viz: 'portfolios', accent: '#ff4fd8',
    intro: 'Let customers understand your services, see pricing and request appointments online.',
    examples: 'Hair salons, beauty studios, spas and independent professionals',
    service: 'business-websites',
    features: ['Service menu and pricing', 'Appointment request flow', 'Staff or stylist selection', 'Offers, gallery and contact details'],
    brief: 'I run a salon or beauty studio and need a website with appointment booking. Please discuss service catalogue, staff selection and booking workflow.'
  },
  {
    key: 'education', label: 'Schools & learning centres', viz: 'analyze', accent: '#b36bff',
    intro: 'Bring teaching, student information and learning resources into one organised platform.',
    examples: 'Schools, coaching centres, tutors and education startups',
    service: 'edtech',
    features: ['Student and teacher dashboards', 'Courses, lessons and assignments', 'Attendance and progress views', 'Role-based access'],
    brief: 'I work in education and need an EdTech platform. Please discuss student/teacher portals, courses, assignments, attendance and reporting.'
  },
  {
    key: 'teams', label: 'Startups & growing teams', viz: 'tasks', accent: '#f4f2fa',
    intro: 'Build the internal tools your team needs when generic software does not fit the workflow.',
    examples: 'Startups, agencies, distributed teams and service businesses',
    service: 'task-management',
    features: ['Task and project workspaces', 'Team chat and collaboration', 'Roles and permissions', 'Custom dashboards and reports'],
    brief: 'I need a custom internal application for my team. Please discuss task management, collaboration/chat, roles, permissions and reporting.'
  },
];

const FILTERS = [
  ['all', 'All solutions'],
  ['commerce', 'Sell online'],
  ['service', 'Bookings & services'],
  ['learning', 'Education'],
  ['teams', 'Teams & startups'],
];

function groupFor(item) {
  if (['retail', 'kitchen', 'bakery'].includes(item.key)) return 'commerce';
  if (item.key === 'salon') return 'service';
  if (item.key === 'education') return 'learning';
  return 'teams';
}

export default function BusinessSolutions() {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState('retail');
  const visible = INDUSTRIES.filter((item) => filter === 'all' || groupFor(item) === filter);

  return (
    <section className="sec business-solutions" id="solutions" aria-labelledby="solutions-title">
      <div className="sec-head">
        <span className="eyebrow">Solutions by industry</span>
        <h2 id="solutions-title">Technology that fits the way you do business.</h2>
        <p>Explore practical website and application ideas for local businesses, professionals, education teams and startups. Every build is customised to the way you work.</p>
      </div>

      <div className="solution-filters" role="group" aria-label="Filter business solutions">
        {FILTERS.map(([key, label]) => (
          <button key={key} type="button" className={`solution-filter${filter === key ? ' active' : ''}`} aria-pressed={filter === key} onClick={() => { setFilter(key); setExpanded(''); }}>
            {label}
          </button>
        ))}
      </div>

      <div className="cards solution-grid">
        {visible.map((item) => {
          const open = expanded === item.key;
          const brief = encodeURIComponent(item.brief);
          return (
            <article className={`card solution-card${open ? ' expanded' : ''}`} style={{ '--c': item.accent }} key={item.key}>
              <button className="solution-card-toggle" type="button" aria-expanded={open} onClick={() => setExpanded(open ? '' : item.key)}>
                <Viz kind={item.viz} />
                <span className="solution-card-title">{item.label}</span>
                <span className="solution-card-intro">{item.intro}</span>
                <span className="solution-card-examples">{item.examples}</span>
                <span className="more">{open ? 'Hide details' : 'Explore solution'}</span>
              </button>
              {open && (
                <div className="solution-card-details">
                  <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                  <Link className="btn sm" to={`/contact?service=${item.service}&brief=${brief}`}>Discuss this solution</Link>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="solution-custom panel">
        <div>
          <span className="eyebrow">Have a different idea?</span>
          <h3>Tell us what your business needs.</h3>
          <p>From a simple online presence to a custom web application, we can shape the scope around your goals, users and budget.</p>
        </div>
        <Link className="btn ghost" to="/contact?service=other">Build something custom</Link>
      </div>
    </section>
  );
}
