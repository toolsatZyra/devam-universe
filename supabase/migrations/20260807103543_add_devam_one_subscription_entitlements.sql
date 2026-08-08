create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_code text not null default 'devam_one' check (plan_code = 'devam_one'),
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'paused', 'beta_access')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  source text not null check (source in ('billing_sync', 'manual_beta')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'beta_access' or source = 'manual_beta')
);

comment on table public.subscriptions is
  'Provider-neutral Devam One entitlement state. Billing identifiers and webhook payloads do not belong in this user-readable table.';

alter table public.subscriptions enable row level security;

revoke all on table public.subscriptions from anon;
revoke all on table public.subscriptions from authenticated;
grant select on table public.subscriptions to authenticated;

create policy subscriptions_own_select on public.subscriptions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create index subscriptions_status_period_idx
  on public.subscriptions (status, current_period_end);
