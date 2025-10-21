-- migration: create initial database schema for julklapp
-- created at: 2025-10-21 09:45:00 utc
-- purpose: define type, tables, indexes, row level security policies according to db-plan.md

-- enable pgcrypto extension for uuid generation
drop extension if exists "pgcrypto";
create extension if not exists "pgcrypto";

-- create user_role_enum type
drop type if exists user_role_enum;
create type user_role_enum as enum ('author', 'participant');

-- create draws table
create table public.draws (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone not null default now()
);

-- enable row level security for draws
alter table draws enable row level security;

-- authors can select only their own draws
create policy author_select on draws for select using (author_id = auth.uid());
-- authors can insert, update, delete only their own draws
create policy author_modify on draws for all using (author_id = auth.uid());

-- create draw_participants table
create table draw_participants (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references draws(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  surname text not null,
  email text not null,
  gift_preferences text not null check (char_length(gift_preferences) <= 10000),
  created_at timestamp with time zone not null default now()
);

-- add indexes for draw_participants
create index on draw_participants (draw_id);
create index on draw_participants (user_id);

-- enable row level security for draw_participants
alter table draw_participants enable row level security;

-- authors can view all participants in their draws
create policy author_view_participants on draw_participants for select using (
  exists (
    select 1 from draws
    where draws.id = draw_participants.draw_id
      and draws.author_id = auth.uid()
  )
);
-- participants can select and update their own record
create policy participant_self_manage on draw_participants for all using (user_id = auth.uid());

-- create matches table
create table matches (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references draws(id) on delete cascade,
  giver_id uuid not null references draw_participants(id) on delete cascade,
  recipient_id uuid not null references draw_participants(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (draw_id, giver_id),
  unique (draw_id, recipient_id),
  check (giver_id <> recipient_id)
);

-- add indexes for matches
create index on matches (draw_id);
create index on matches (giver_id);
create index on matches (recipient_id);

-- enable row level security for matches
alter table matches enable row level security;

-- authors can view all matches in their draws
create policy author_view_matches on matches for select using (
  exists (
    select 1 from draws
    where draws.id = matches.draw_id
      and draws.author_id = auth.uid()
  )
);
-- participants can view their own match
create policy participant_view_match on matches for select using (
  exists (
    select 1 from draw_participants
    where draw_participants.id = matches.giver_id
      and draw_participants.user_id = auth.uid()
  )
);

-- create ai_suggestions table
drop table if exists ai_suggestions;
create table ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references matches(id) on delete cascade,
  data jsonb not null,
  created_at timestamp with time zone not null default now()
);

-- enable row level security for ai_suggestions
alter table ai_suggestions enable row level security;

-- authors can view suggestions for matches in their draws
create policy author_view_suggestions on ai_suggestions for select using (
  exists (
    select 1 from matches
    join draws on matches.draw_id = draws.id
    where ai_suggestions.match_id = matches.id
      and draws.author_id = auth.uid()
  )
);
-- participants can view suggestions for their own match
create policy participant_view_suggestions on ai_suggestions for select using (
  exists (
    select 1 from matches
    join draw_participants on matches.giver_id = draw_participants.id
    where ai_suggestions.match_id = matches.id
      and draw_participants.user_id = auth.uid()
  )
);
