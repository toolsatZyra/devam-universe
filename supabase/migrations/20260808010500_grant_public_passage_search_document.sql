-- The exact-passage RPC ranks against the generated tsvector. Keep the grant
-- column-limited and retain the existing low-privilege owner/RLS boundary.

grant select (search_document)
  on public.passages to devam_public_search_executor;

do $$
begin
  if not has_column_privilege(
    'devam_public_search_executor',
    'public.passages',
    'search_document',
    'SELECT'
  ) then
    raise exception 'public passage search executor cannot read passages.search_document';
  end if;
  if has_table_privilege('devam_public_search_executor', 'public.passages', 'SELECT') then
    raise exception 'public passage search executor unexpectedly has table-wide passage access';
  end if;
end
$$;
