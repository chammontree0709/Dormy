-- Dormy: Supabase schema (cleaned)
-- Run this in your Supabase SQL editor at https://app.supabase.com
--
-- Notes vs. the original:
--   * Removed `using (true)` on rooms — invite-code joins go through an RPC.
--   * Replaced self-referencing room_members policy (caused infinite recursion)
--     with a security-definer helper `is_room_member`.
--   * Added missing rooms update/delete and room_members delete policies.
--   * Added `with check` to the member update policy.
--   * Added indexes for the most common lookups.

-- =========================================================
-- Tables
-- =========================================================

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists room_members (
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz default now(),
  primary key (room_id, user_id)
);

create table if not exists room_items (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  preset_id text,
  custom_name text,
  custom_url text,
  category text not null default 'storage',
  is_checked boolean default false,
  checked_by_name text,
  checked_at timestamptz,
  claimed_by_name text,
  claimed_at timestamptz,
  added_by_name text not null,
  added_at timestamptz default now(),
  notes text,
  sort_order int default 0
);

-- Helpful indexes
create index if not exists room_members_user_idx on room_members(user_id);
create index if not exists room_items_room_idx   on room_items(room_id);

-- =========================================================
-- Helpers (security definer — bypass RLS to avoid recursion)
-- =========================================================

create or replace function is_room_member(p_room_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from room_members
    where room_id = p_room_id and user_id = p_user_id
  );
$$;

revoke all on function is_room_member(uuid, uuid) from public;
grant execute on function is_room_member(uuid, uuid) to authenticated;

-- Join a room by invite code. Returns the room id on success.
-- This is how clients look up a room without exposing the rooms table.
create or replace function join_room_by_invite_code(
  p_invite_code text,
  p_display_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select id into v_room_id from rooms where invite_code = p_invite_code;
  if v_room_id is null then
    raise exception 'invalid invite code';
  end if;

  insert into room_members (room_id, user_id, display_name)
  values (v_room_id, auth.uid(), p_display_name)
  on conflict (room_id, user_id) do update
    set display_name = excluded.display_name;

  return v_room_id;
end;
$$;

revoke all on function join_room_by_invite_code(text, text) from public;
grant execute on function join_room_by_invite_code(text, text) to authenticated;

-- =========================================================
-- Row-level security
-- =========================================================

alter table rooms        enable row level security;
alter table room_members enable row level security;
alter table room_items   enable row level security;

-- ---- rooms ----------------------------------------------

create policy "Rooms readable by members" on rooms
  for select using (
    is_room_member(id, auth.uid())
    or auth.uid() = created_by
  );

create policy "Rooms creatable by authenticated users" on rooms
  for insert with check (auth.uid() = created_by);

create policy "Rooms updatable by creator" on rooms
  for update using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Rooms deletable by creator" on rooms
  for delete using (auth.uid() = created_by);

-- ---- room_members ---------------------------------------

create policy "Members readable by room members" on room_members
  for select using (
    is_room_member(room_id, auth.uid())
  );

-- Direct inserts are allowed for the user themselves; the normal join path
-- is the join_room_by_invite_code RPC above.
create policy "Members can join rooms" on room_members
  for insert with check (auth.uid() = user_id);

create policy "Members can update their own row" on room_members
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Members can leave rooms" on room_members
  for delete using (auth.uid() = user_id);

-- ---- room_items -----------------------------------------

create policy "Items readable by room members" on room_items
  for select using (is_room_member(room_id, auth.uid()));

create policy "Items creatable by room members" on room_items
  for insert with check (is_room_member(room_id, auth.uid()));

create policy "Items updatable by room members" on room_items
  for update using (is_room_member(room_id, auth.uid()))
  with check (is_room_member(room_id, auth.uid()));

create policy "Items deletable by room members" on room_items
  for delete using (is_room_member(room_id, auth.uid()));

-- =========================================================
-- Realtime
-- =========================================================

alter publication supabase_realtime add table room_items;
