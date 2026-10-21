create table if not exists public.community_posts (
  id text primary key,
  title text not null,
  preview text not null default '',
  content text not null,
  author text not null default 'You',
  time_ago text not null default 'Just now',
  tags jsonb not null default '[]'::jsonb,
  likes integer not null default 0,
  liked boolean not null default false,
  replies jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

create policy "Community posts are viewable by everyone"
on public.community_posts
for select
using (true);

create policy "Community posts can be inserted by everyone"
on public.community_posts
for insert
with check (true);

create policy "Community posts can be updated by everyone"
on public.community_posts
for update
using (true)
with check (true);
