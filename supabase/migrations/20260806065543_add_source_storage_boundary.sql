alter table public.source_objects
  add column storage_backend text not null default 'local_vault'
    check (storage_backend in ('local_vault', 'supabase_storage')),
  add column storage_bucket text;

alter table public.source_objects
  add constraint source_objects_storage_location_check check (
    (storage_backend = 'local_vault' and storage_bucket is null)
    or
    (storage_backend = 'supabase_storage' and storage_bucket is not null)
  );

-- The first source bucket is private and intentionally has no anon or
-- authenticated storage.objects policy. Only a trusted server-side ingestion
-- worker may eventually upload. The 50 MiB ceiling keeps this pilot bounded;
-- larger archival carriers require a separately reviewed upload path.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'devam-source-objects',
  'devam-source-objects',
  false,
  52428800,
  array[
    'application/pdf',
    'application/xml',
    'application/tei+xml',
    'text/xml',
    'text/plain',
    'text/html',
    'application/zip',
    'application/octet-stream'
  ]::text[]
);
