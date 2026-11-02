-- SifoProperty dedicated database baseline.
-- Apply only to the SifoProperty Supabase project after review; never to SifoBooks.
create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  tpin text,
  currency text not null default 'ZMW',
  owner_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','accountant','agent','maintenance','viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id,user_id)
);

create or replace function public.is_property_member(target_org uuid)
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.organization_members m where m.organization_id=target_org and m.user_id=auth.uid()); $$;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_code text not null,
  name text not null,
  property_type text not null default 'residential',
  address text,
  city text,
  country text not null default 'Zambia',
  owner_name text,
  status text not null default 'active' check (status in ('active','inactive','under_maintenance','sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,property_code)
);

create table if not exists public.property_units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id),
  unit_code text not null,
  unit_type text not null default 'apartment',
  bedrooms numeric(5,2) not null default 0,
  bathrooms numeric(5,2) not null default 0,
  monthly_rent numeric(14,2) not null default 0 check(monthly_rent>=0),
  deposit_required numeric(14,2) not null default 0 check(deposit_required>=0),
  status text not null default 'vacant' check(status in ('vacant','occupied','reserved','maintenance','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,property_id,unit_code)
);

create table if not exists public.property_tenants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_no text not null,
  full_name text not null,
  phone text,
  email text,
  national_id text,
  emergency_contact text,
  status text not null default 'active' check(status in ('active','inactive','blacklisted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,tenant_no)
);

create table if not exists public.property_leases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lease_no text not null,
  unit_id uuid not null references public.property_units(id),
  tenant_id uuid not null references public.property_tenants(id),
  start_date date not null,
  end_date date,
  rent_amount numeric(14,2) not null check(rent_amount>=0),
  deposit_amount numeric(14,2) not null default 0 check(deposit_amount>=0),
  billing_frequency text not null default 'monthly' check(billing_frequency in ('weekly','monthly','quarterly','annually')),
  status text not null default 'draft' check(status in ('draft','active','expired','terminated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,lease_no),
  check(end_date is null or end_date>=start_date)
);

create table if not exists public.property_charges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lease_id uuid not null references public.property_leases(id),
  charge_type text not null default 'rent',
  description text not null,
  amount numeric(14,2) not null check(amount>0),
  due_date date not null,
  status text not null default 'unpaid' check(status in ('unpaid','part_paid','paid','waived','void')),
  source_reference text,
  created_at timestamptz not null default now(),
  unique(organization_id,source_reference)
);

create table if not exists public.property_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lease_id uuid references public.property_leases(id),
  tenant_id uuid references public.property_tenants(id),
  receipt_no text not null,
  amount numeric(14,2) not null check(amount>0),
  currency text not null default 'ZMW',
  method text not null check(method in ('cash','bank','mobile_money','card','other')),
  payment_reference text,
  payment_date timestamptz not null default now(),
  recorded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(organization_id,receipt_no)
);

create table if not exists public.property_maintenance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id),
  unit_id uuid references public.property_units(id),
  title text not null,
  description text,
  priority text not null default 'normal' check(priority in ('low','normal','high','urgent')),
  status text not null default 'open' check(status in ('open','assigned','in_progress','completed','cancelled')),
  assigned_to uuid references auth.users(id),
  estimated_cost numeric(14,2) not null default 0 check(estimated_cost>=0),
  actual_cost numeric(14,2) not null default 0 check(actual_cost>=0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_expenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid references public.properties(id),
  expense_date date not null default current_date,
  category text not null,
  description text not null,
  amount numeric(14,2) not null check(amount>0),
  supplier_name text,
  reference text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
create policy "property org members read own org" on public.organizations for select using(public.is_property_member(id));
create policy "property owner creates org" on public.organizations for insert with check(owner_user_id=auth.uid());
create policy "property org owners update org" on public.organizations for update using(owner_user_id=auth.uid()) with check(owner_user_id=auth.uid());
create policy "property members read membership" on public.organization_members for select using(public.is_property_member(organization_id));
create policy "property owner adds first members" on public.organization_members for insert with check(
  user_id=auth.uid() and role='owner' and exists(select 1 from public.organizations o where o.id=organization_id and o.owner_user_id=auth.uid())
);

do $$ declare t text; begin
  foreach t in array array['properties','property_units','property_tenants','property_leases','property_charges','property_payments','property_maintenance','property_expenses'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('create policy "org members manage %1$I" on public.%1$I for all using(public.is_property_member(organization_id)) with check(public.is_property_member(organization_id))',t);
  end loop;
end $$;

create index if not exists property_units_property_idx on public.property_units(organization_id,property_id);
create index if not exists property_leases_tenant_idx on public.property_leases(organization_id,tenant_id,status);
create index if not exists property_charges_due_idx on public.property_charges(organization_id,due_date,status);
create index if not exists property_payments_date_idx on public.property_payments(organization_id,payment_date desc);
create index if not exists property_maintenance_status_idx on public.property_maintenance(organization_id,status,priority);
