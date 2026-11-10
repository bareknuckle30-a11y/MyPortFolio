// Site-wide constants and shared content. Edit the [PLACEHOLDER] values before launch.

export const SITE = {
  name: 'Webhead Solutions',
  tagline: 'Digital products for people and growing businesses',
  url: (import.meta.env.VITE_SITE_URL || 'https://yourdomain.com').replace(/\/$/, ''),
  email: import.meta.env.VITE_CONTACT_EMAIL || 'hello@example.com',
  booking: import.meta.env.VITE_BOOKING_URL || '',
  owner: '[PLACEHOLDER: your name]',
  location: '[PLACEHOLDER: city, country]',
  responseTime: 'one business day',
};

export const NAV = [
  { to: '/#services', label: 'Services' },
  { to: '/#solutions', label: 'Business solutions' },
  { to: '/work', label: 'Work' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

// The three phases, reused as the animated "How we work" cards.
export const PHASES = [
  {
    key: 'build',
    title: 'Build',
    accent: '#b36bff',
    desc: 'We design and ship the first version fast, with a live preview you can click through along the way.',
    items: ['Scope agreed in writing', 'Weekly working builds', 'Accessible and fast by default'],
  },
  {
    key: 'analyze',
    title: 'Analyze',
    accent: '#f4f2fa',
    desc: 'Tracking goes in from day one, so you see what visitors and users actually do before deciding what to change.',
    items: ['Event tracking and dashboards', 'Funnel and conversion reports', 'Findings in plain language'],
  },
  {
    key: 'scale',
    title: 'Scale',
    accent: '#ff4fd8',
    desc: 'As traffic and features grow, we keep it quick and stable with tuning, monitoring and careful releases.',
    items: ['Performance tuning', 'Monitoring and alerts', 'Growth experiments that stick'],
  },
];

export const HOME_FAQ = [
  {
    q: 'How does a project start?',
    a: 'You send a short message from the contact page or project brief builder. We clarify the requirements, then agree scope, timeline and price in writing before any work begins.',
  },
  {
    q: 'Do I need to know what I want before we talk?',
    a: 'No. Many clients arrive with a problem rather than a spec. Part of the first call is working out the smallest version that solves it.',
  },
  {
    q: 'Who owns the code, the design and the data?',
    a: 'Ownership, licensing, third-party assets and data responsibilities are documented in the project proposal before work begins. We explain any ongoing service or provider costs before launch.',
  },
  {
    q: 'What happens after launch?',
    a: 'You can take the site over yourself, or keep us on for fixes and improvements. For websites and applications, ongoing maintenance is the service itself.',
  },
  {
    q: 'Can you work with the tools we already use?',
    a: 'Usually yes. We connect to existing payment providers, databases, analytics and email tools through their APIs. We confirm what is possible during the first call.',
  },
];

// Shown only if the API is unreachable, so the page never looks empty. Clearly labelled placeholders.
export const FALLBACK_PROJECTS = [
  { slug: '', title: 'XTPL TaskManager', summary: 'A task and team collaboration application with workflow-focused task management.', services: ['task-management'], tags: ['React', 'Node.js', 'Supabase'] },
  { slug: '', title: 'Paromita Mazumder Portfolio', summary: 'A personalised portfolio experience designed to present an individual’s work and professional identity.', services: ['portfolios'], tags: ['React', 'Responsive UI', 'Portfolio'] },
  { slug: '', title: 'EdTech Dashboard', summary: 'An education-focused dashboard concept for organising learning and administration workflows.', services: ['edtech'], tags: ['Dashboard', 'EdTech', 'Web App'] },
];

export const SERVICE_OPTIONS = [
  { value: 'portfolios', label: 'Personal Portfolio / Resume Website' },
  { value: 'business-websites', label: 'Business Website / Landing Page' },
  { value: 'task-management', label: 'Task Management Application' },
  { value: 'chat-apps', label: 'Personal or Team Chat Application' },
  { value: 'edtech', label: 'EdTech / Learning Platform' },
  { value: 'ecommerce', label: 'Online Store / E-commerce Website' },
  { value: 'custom-solutions', label: 'Custom Dashboard / Business Application' },
  { value: 'data-pipelines', label: 'Data & Automation Solution' },
  { value: 'other', label: 'Something else' },
];

// [PLACEHOLDER] Adjust ranges and currency. Values must match server/src/schemas.js.
export const BUDGET_OPTIONS = [
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'under-1k', label: 'Under 1k' },
  { value: '1k-3k', label: '1k to 3k' },
  { value: '3k-10k', label: '3k to 10k' },
  { value: '10k-plus', label: '10k+' },
];
