-- Placeholder case studies. Clearly labeled so they are never mistaken for real client work.
-- Replace or delete these once you have real projects.

insert into public.projects (slug, title, summary, services, tags, problem, approach, result, published)
values
(
  'placeholder-portfolio',
  '[PLACEHOLDER] Portfolio for a freelance designer',
  'Replace this with one line about the client and what you built.',
  array['portfolios'],
  array['React', 'Animation', 'SEO'],
  '[PLACEHOLDER] Describe the problem the client had before the project.',
  '[PLACEHOLDER] Describe what you built and why you made the key decisions.',
  '[PLACEHOLDER] Describe the measurable result, using real numbers only.',
  true
),
(
  'placeholder-task-manager',
  '[PLACEHOLDER] Task management system for a small team',
  'Replace this with one line about the client and what you built.',
  array['task-management'],
  array['React', 'Node', 'Supabase'],
  '[PLACEHOLDER] Describe the problem the client had before the project.',
  '[PLACEHOLDER] Describe what you built and why you made the key decisions.',
  '[PLACEHOLDER] Describe the measurable result, using real numbers only.',
  true
),
(
  'placeholder-data-pipeline',
  '[PLACEHOLDER] Managed data pipeline for an online store',
  'Replace this with one line about the client and what you maintain.',
  array['data-pipelines', 'ecommerce'],
  array['dbt', 'Postgres', 'Monitoring'],
  '[PLACEHOLDER] Describe the problem the client had before the project.',
  '[PLACEHOLDER] Describe what you set up and what you monitor.',
  '[PLACEHOLDER] Describe the measurable result, using real numbers only.',
  true
)
on conflict (slug) do nothing;
