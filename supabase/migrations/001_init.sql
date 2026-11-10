-- Webhead Solutions: initial schema
-- Run in the Supabase SQL editor (or `supabase db push`), then run supabase/seed.sql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tables
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 254),
  service     text not null,
  budget      text,
  message     text not null check (char_length(message) between 1 and 5000),
  status      text not null default 'new' check (status in ('new', 'replied', 'closed')),
  source      text not null default 'website'
);
create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);
create index if not exists contact_submissions_status_idx  on public.contact_submissions (status);

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  email         text not null unique check (char_length(email) between 3 and 254),
  confirmed     boolean not null default false,
  confirmed_at  timestamptz,
  confirm_token text not null unique default encode(gen_random_bytes(24), 'hex')
);

create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title      text not null,
  summary    text not null,
  services   text[] not null default '{}',
  tags       text[] not null default '{}',
  cover_url  text,
  problem    text,
  approach   text,
  result     text,
  published  boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists projects_published_idx on public.projects (published, created_at desc);

-- People allowed into /admin. Add your own login email after creating the user
-- in Supabase Auth:  insert into public.admins (email) values ('you@example.com');
create table if not exists public.admins (
  email text primary key
);

-- ---------------------------------------------------------------- helpers
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------- row level security
alter table public.contact_submissions   enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.projects              enable row level security;
alter table public.admins                enable row level security;

-- The Express API uses the service-role key, which bypasses RLS, so it needs no policies.
-- Everything below is for browser clients (anon key / signed-in users).

-- projects: anyone can read published rows. No public writes.
drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
  on public.projects for select
  to anon, authenticated
  using (published = true);

-- contact_submissions: admins can read, and change status only.
drop policy if exists "admins read leads" on public.contact_submissions;
create policy "admins read leads"
  on public.contact_submissions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update lead status" on public.contact_submissions;
create policy "admins update lead status"
  on public.contact_submissions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke update on public.contact_submissions from authenticated;
grant  update (status) on public.contact_submissions to authenticated;

-- newsletter_subscribers: admins can read. Writes only through the API.
drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (public.is_admin());

-- admins: a signed-in user can see only their own row (lets the client check access).
drop policy if exists "admins see themselves" on public.admins;
create policy "admins see themselves"
  on public.admins for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Make sure the anon role cannot touch private tables even if a policy is added by mistake.
revoke all on public.contact_submissions    from anon;
revoke all on public.newsletter_subscribers from anon;
revoke all on public.admins                 from anon;
