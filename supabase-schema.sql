-- ============================================
-- ENUMS
-- ============================================
create type tribe_enum as enum ('Amber','Ruby','Diamond','Emerald','Unassigned');

create type school_level_enum as enum (
  'In Secondary School',
  'Finished Secondary School',
  'In University',
  'Finished University'
);

create type unit_of_service_enum as enum (
  'None','Ushering','Drama','Greeters','Choir',
  'Free Spirit Media','Fierce','Dance team','Integrative','Service Draft'
);

create type admin_role as enum ('super_admin','tribe_leader');

-- ============================================
-- TABLES
-- ============================================
create table members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  tribe tribe_enum not null default 'Unassigned',
  date_of_birth date not null,
  unit_of_service unit_of_service_enum not null default 'None',
  school_level school_level_enum not null,
  whatsapp_number text unique not null,
  completed_membership_class boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role admin_role not null default 'tribe_leader',
  assigned_tribe tribe_enum,  -- null for super_admin
  created_at timestamptz default now()
);

-- ============================================
-- HELPER FUNCTIONS (avoid RLS recursion)
-- ============================================
create or replace function auth_role()
returns admin_role
language sql security definer stable
as $$
  select role from admins where id = auth.uid();
$$;

create or replace function auth_tribe()
returns tribe_enum
language sql security definer stable
as $$
  select assigned_tribe from admins where id = auth.uid();
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table members enable row level security;
alter table admins enable row level security;

-- Public can register (insert only, no read/edit)
create policy "public can register"
on members for insert
to anon
with check (true);

-- Super admin: full access
create policy "super admin full access"
on members for all
to authenticated
using (auth_role() = 'super_admin')
with check (auth_role() = 'super_admin');

-- Tribe leader: can view own tribe + unassigned (to claim them)
create policy "tribe leader can view"
on members for select
to authenticated
using (
  auth_role() = 'tribe_leader'
  and (tribe = auth_tribe() or tribe = 'Unassigned')
);

-- Tribe leader: can edit own tribe members, or claim unassigned into their tribe
create policy "tribe leader can update"
on members for update
to authenticated
using (
  auth_role() = 'tribe_leader'
  and (tribe = auth_tribe() or tribe = 'Unassigned')
)
with check (
  auth_role() = 'tribe_leader'
  and tribe = auth_tribe()
);

-- Admins table: super admin manages all, tribe leaders see only themselves
create policy "super admin manages admins"
on admins for all
to authenticated
using (auth_role() = 'super_admin')
with check (auth_role() = 'super_admin');

create policy "tribe leader views self"
on admins for select
to authenticated
using (id = auth.uid());

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger members_updated_at
before update on members
for each row execute function set_updated_at();
