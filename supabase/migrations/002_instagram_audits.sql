
-- Instagram audit leads and generated preliminary reports.
create table if not exists public.instagram_audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  business_name text,
  instagram_url text not null,
  business_type text not null,
  primary_goal text not null,
  posting_frequency text not null,
  has_website text not null,
  bio_clarity text not null,
  content_challenge text not null,
  recommended_service text not null,
  score integer not null check (score between 0 and 100),
  report jsonb not null,
  consent boolean not null default false,
  source text not null default 'instagram-audit'
);
create index if not exists instagram_audits_created_idx on public.instagram_audits (created_at desc);
create index if not exists instagram_audits_email_idx on public.instagram_audits (email);
alter table public.instagram_audits enable row level security;
revoke all on public.instagram_audits from anon, authenticated;
-- The Express API inserts using the server-only Supabase service-role key.
