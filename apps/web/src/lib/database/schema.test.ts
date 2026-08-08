import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDirectory = resolve(process.cwd(), "..", "..", "supabase", "migrations");
const migrationFile = readdirSync(migrationsDirectory).find((name) => name.endsWith("_initial_devam_mvp_foundation.sql"));
if (!migrationFile) throw new Error("Initial Devam migration is missing.");
const sql = readFileSync(resolve(migrationsDirectory, migrationFile), "utf8");
const allSql = readdirSync(migrationsDirectory)
  .filter((name) => name.endsWith(".sql"))
  .sort()
  .map((name) => readFileSync(resolve(migrationsDirectory, name), "utf8"))
  .join("\n");

const createdTables = [...sql.matchAll(/create table public\.([a-z_]+)/g)].map((match) => match[1]).sort();
const rlsTables = [...sql.matchAll(/alter table public\.([a-z_]+) enable row level security/g)].map((match) => match[1]).sort();

describe("initial Devam schema", () => {
  it("enables RLS on every public table", () => {
    expect(rlsTables).toEqual(createdTables);
    expect(createdTables.length).toBe(22);
  });

  it("keeps canonical evidence and calculated Panchang rows server-only", () => {
    const grantStatements = [...sql.matchAll(/grant[\s\S]*?\s+to (?:anon|authenticated|anon, authenticated);/g)].map((match) => match[0]);
    for (const table of ["source_objects", "passages", "claim_evidence", "panchang_calculations"]) {
      expect(grantStatements.some((statement) => new RegExp(`\\b${table}\\b`).test(statement))).toBe(false);
      expect(allSql).toContain(`create policy ${table}_browser_deny`);
    }
  });

  it("uses explicit grants and does not pin extension versions", () => {
    expect(sql).toContain("revoke all on all tables in schema public from anon, authenticated;");
    expect(sql).not.toMatch(/create extension[^;]*version/i);
  });

  it("binds evidence to source-relative passages", () => {
    expect(sql).toContain("primary key (claim_id, passage_id, evidence_role)");
    expect(sql).toContain("unique (source_object_id, source_ordinal)");
    expect(sql).toContain("span_sha256");
  });

  it("covers every foreign key reported by the database advisor", () => {
    for (const index of [
      "atlas_edges_relationship_id_idx",
      "observance_rules_claim_id_idx",
      "observances_entity_id_idx",
      "relationships_claim_id_idx",
      "ritual_steps_claim_id_idx",
      "saved_items_atlas_node_id_idx",
      "user_memories_source_thread_id_idx",
    ]) expect(allSql).toContain(`create index ${index}`);
  });

  it("keeps source payloads behind an explicit private storage boundary", () => {
    expect(allSql).toContain("storage_backend in ('local_vault', 'supabase_storage')");
    expect(allSql).toContain("'devam-source-objects'");
    expect(allSql).toContain("false,\n  52428800");
    expect(allSql).not.toMatch(/create policy[\s\S]*on storage\.objects[\s\S]*to (?:anon|authenticated)/i);
  });

  it("gives authored claims and procedures stable idempotent keys", () => {
    expect(allSql).toContain("add column stable_key text not null");
    expect(allSql).toContain("add constraint claims_stable_key_key unique (stable_key)");
    expect(allSql).toContain("claims_search_document_idx");
    expect(allSql).toContain("add column slug text not null");
    expect(allSql).toContain("add constraint ritual_procedures_slug_key unique (slug)");
  });

  it("exposes only a bounded rights-filtered public knowledge projection", () => {
    expect(allSql).toContain("function public.search_public_knowledge");
    expect(allSql).toContain("security definer");
    expect(allSql).toContain("set search_path = ''");
    expect(allSql).toContain("c.publication_state = 'published'");
    expect(allSql).toContain("p.publication_state = 'published'");
    expect(allSql).toContain("when p.rights_lane in ('product_allowed', 'derivative_allowed') then p.exact_text");
    expect(allSql).toContain("limit greatest(1, least(coalesce(result_limit, 12), 12))");
    expect(allSql).toContain("revoke all on function public.search_public_knowledge(text, text, integer) from public");
    expect(allSql).toContain("owner to devam_public_search_executor");
    expect(allSql).toContain("nobypassrls");
    expect(allSql).toContain("revoke execute on function public.search_public_knowledge(text, text, integer)\n  from authenticated");
    expect(allSql).toContain("to anon, service_role");
  });

  it("exposes exact passages only through the complete published product hierarchy", () => {
    expect(allSql).toContain("function public.search_public_passages");
    expect(allSql).toContain("p.rights_lane in ('product_allowed', 'derivative_allowed')");
    expect(allSql).toContain("s.rights_lane in ('product_allowed', 'derivative_allowed')");
    expect(allSql).toContain("ed.publication_state = 'published'");
    expect(allSql).toContain("ex.publication_state = 'published'");
    expect(allSql).toContain("w.publication_state = 'published'");
    expect(allSql).toContain("p.exact_text is not null");
    expect(allSql).toContain("owner to devam_public_search_executor");
    expect(allSql).toContain("revoke execute on function public.search_public_passages(text, text, integer)\n  from authenticated");
    expect(allSql).toContain("grant execute on function public.search_public_passages(text, text, integer)\n  to anon, service_role");
    expect(allSql).toContain("grant select (search_document)\n  on public.passages to devam_public_search_executor");
    expect(allSql).toContain("has_table_privilege('devam_public_search_executor', 'public.passages', 'SELECT')");
    expect(allSql).toContain("'sourceCompletenessStatus', m.source_completeness_status");
    expect(allSql).toContain("grant select (completeness_status)\n  on public.source_objects to devam_public_search_executor");
    expect(allSql).not.toMatch(/search_public_passages[\s\S]*?p\.rights_lane in \([^)]*citation_only/i);
  });
});
