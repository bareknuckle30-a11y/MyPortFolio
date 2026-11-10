/** Curated projects are bundled with the client so they appear even when the API is offline. */
export const FEATURED_PROJECTS = [
  {
    slug: 'xtpl-taskmanager', title: 'XTPL TaskManager', category: 'Productivity platform',
    summary: 'A collaborative workspace for organizing tasks, coordinating teams and tracking progress.',
    problem: 'Teams need a central place to coordinate assignments, deadlines and project status without losing context.',
    approach: 'A task-first workspace with team-oriented views and an emphasis on clear progress tracking.',
    result: 'A deployed task management application available to explore through the live project link.',
    tags: ['Task Management', 'Collaboration', 'Web App'], services: ['task-management'],
    live_url: 'https://taskmanager-v2-0-frontend.onrender.com', preview: 'tasks', accent: '#a78bfa'
  },
  {
    slug: 'paromita-mazumder-portfolio', title: 'Paromita Mazumder — Portfolio', category: 'Personal website',
    summary: 'A personalized digital portfolio built to present an individual identity and body of work.',
    problem: 'A personal portfolio needs to communicate identity, experience and work clearly in one memorable destination.',
    approach: 'A focused presentation with a personalized visual language and responsive browsing experience.',
    result: 'A published personal portfolio that visitors can explore on its live website.',
    tags: ['Portfolio', 'Personal Branding', 'Responsive'], services: ['portfolios'],
    live_url: 'https://sunny-biscochitos-57ca6f.netlify.app', preview: 'portfolio', accent: '#fb7185'
  },
  {
    slug: 'edtech-dashboard', title: 'EdTech Dashboard', category: 'Education technology',
    summary: 'An education-focused dashboard concept for making learning information easier to navigate.',
    problem: 'Education workflows benefit from an organized interface that brings key learning information into view.',
    approach: 'A dashboard-oriented interface with clear information hierarchy and accessible navigation patterns.',
    result: 'A deployed EdTech experience available for live exploration.',
    tags: ['EdTech', 'Dashboard', 'UI/UX'], services: [],
    live_url: 'https://ed-ex-olive.vercel.app', preview: 'edtech', accent: '#38bdf8'
  }
];
export const featuredBySlug = (slug) => FEATURED_PROJECTS.find((p) => p.slug === slug);
