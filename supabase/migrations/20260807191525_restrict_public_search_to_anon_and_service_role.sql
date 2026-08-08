-- The app's public search and Sarthi endpoints call this RPC server-side with
-- the publishable key, which executes as anon. Signed-in browsers have no
-- reason to call the evidence projection directly, so keep that role out of
-- the function ACL. service_role remains available for server maintenance.
grant devam_public_search_executor to postgres
  with admin false, inherit false, set true;
set local role devam_public_search_executor;

revoke execute on function public.search_public_knowledge(text, text, integer)
  from authenticated;

revoke all on function public.search_public_knowledge(text, text, integer)
  from public;
grant execute on function public.search_public_knowledge(text, text, integer)
  to anon, service_role;

comment on function public.search_public_knowledge(text, text, integer) is
  'Static anon-facing projection over published product-compatible claims and evidence. Owned by a no-login, no-bypass-RLS role with column-limited grants; authenticated direct execution is intentionally denied.';

reset role;
revoke devam_public_search_executor from postgres;

do $$
begin
  if has_function_privilege('authenticated', 'public.search_public_knowledge(text,text,integer)', 'EXECUTE') then
    raise exception 'authenticated must not execute search_public_knowledge directly';
  end if;
  if not has_function_privilege('anon', 'public.search_public_knowledge(text,text,integer)', 'EXECUTE') then
    raise exception 'anon must execute search_public_knowledge for the server-side public product route';
  end if;
end
$$;
