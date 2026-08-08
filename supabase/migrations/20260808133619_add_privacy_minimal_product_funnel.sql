-- Privacy-minimal, first-party launch funnel. This table deliberately stores no
-- query text, Sarthi messages, ritual/location selections, email, user id, IP,
-- user agent, source content, or arbitrary JSON. The browser cannot read rows.
create table public.product_events (
  id uuid primary key,
  session_id uuid not null,
  event_name text not null check (event_name in (
    'atlas_opened',
    'atlas_gateway_opened',
    'search_submitted',
    'search_results_rendered',
    'sarthi_question_submitted',
    'sarthi_answer_rendered',
    'today_resolved',
    'account_sign_in_requested',
    'account_signed_in'
  )),
  surface text not null check (surface in ('atlas', 'search', 'sarthi', 'today', 'account')),
  target text,
  account_state text not null check (account_state in ('guest', 'signed_in')),
  occurred_at timestamptz not null default now(),
  retain_until timestamptz not null default (now() + interval '90 days'),
  constraint product_events_surface_and_target_check check (
    (event_name = 'atlas_opened' and surface = 'atlas' and target is null)
    or (event_name = 'atlas_gateway_opened' and surface = 'atlas' and target in ('ganesha', 'durga', 'ramayana', 'diwali'))
    or (event_name = 'search_submitted' and surface = 'search' and target is null)
    or (event_name = 'search_results_rendered' and surface = 'search' and target in ('grounded', 'catalog', 'mixed', 'empty', 'unavailable'))
    or (event_name = 'sarthi_question_submitted' and surface = 'sarthi' and target in ('standalone', 'atlas'))
    or (event_name = 'sarthi_answer_rendered' and surface = 'sarthi' and target in ('answer', 'clarification', 'unavailable'))
    or (event_name = 'today_resolved' and surface = 'today' and target in ('observance', 'calendar_only'))
    or (event_name in ('account_sign_in_requested', 'account_signed_in') and surface = 'account' and target is null)
  ),
  constraint product_events_retention_check check (
    retain_until >= occurred_at + interval '89 days'
    and retain_until <= occurred_at + interval '91 days'
  )
);

create index product_events_event_occurred_at_idx
  on public.product_events (event_name, occurred_at desc);
create index product_events_session_occurred_at_idx
  on public.product_events (session_id, occurred_at);
create index product_events_retain_until_idx
  on public.product_events (retain_until);

alter table public.product_events enable row level security;

revoke all on public.product_events from public, anon, authenticated;
grant insert on public.product_events to anon, authenticated, service_role;
grant select, delete on public.product_events to service_role;

-- The application route supplies server-generated time and account state. RLS
-- also bounds direct Data API inserts to the same short ingestion window.
create policy product_events_anon_insert_only
  on public.product_events
  for insert
  to anon
  with check (
    account_state = 'guest'
    and occurred_at >= now() - interval '5 minutes'
    and occurred_at <= now() + interval '1 minute'
    and retain_until >= occurred_at + interval '89 days'
    and retain_until <= occurred_at + interval '91 days'
  );

create policy product_events_authenticated_insert_only
  on public.product_events
  for insert
  to authenticated
  with check (
    account_state = 'signed_in'
    and (select auth.uid()) is not null
    and occurred_at >= now() - interval '5 minutes'
    and occurred_at <= now() + interval '1 minute'
    and retain_until >= occurred_at + interval '89 days'
    and retain_until <= occurred_at + interval '91 days'
  );

comment on table public.product_events is
  '90-day privacy-minimal Devam launch funnel. No user content, location, email, user id, IP, user agent, or arbitrary properties.';

create view public.product_funnel_daily
with (security_invoker = true)
as
select
  date_trunc('day', occurred_at) as event_day,
  event_name,
  surface,
  target,
  account_state,
  count(*) as event_count,
  count(distinct session_id) as unique_sessions
from public.product_events
where retain_until > now()
group by date_trunc('day', occurred_at), event_name, surface, target, account_state;

revoke all on public.product_funnel_daily from public, anon, authenticated;
grant select on public.product_funnel_daily to service_role;

comment on view public.product_funnel_daily is
  'Service-role-only daily aggregate over unexpired privacy-minimal product events.';
