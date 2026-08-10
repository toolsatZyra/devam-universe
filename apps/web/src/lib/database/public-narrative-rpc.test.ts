import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDirectory = resolve(process.cwd(), "..", "..", "supabase", "migrations");
const migrationFile = readdirSync(migrationsDirectory).find((name) => name.endsWith("_add_public_narrative_read_rpc.sql"));
if (!migrationFile) throw new Error("Public narrative RPC migration is missing.");
const sql = readFileSync(resolve(migrationsDirectory, migrationFile), "utf8");

describe("public narrative read RPC", () => {
  it("uses RLS-preserving invoker rights and explicit grants", () => {
    expect(sql).toContain("security invoker");
    expect(sql).toContain("revoke all on function public.get_public_narrative_series(text, text) from public");
    expect(sql).toContain("grant execute on function public.get_public_narrative_series(text, text) to anon, authenticated");
    expect(sql).not.toContain("security definer");
  });

  it("returns consumer narrative without evidence apparatus", () => {
    expect(sql).toContain("'narrative', moment_copy.narrative");
    expect(sql).toContain("'visualDirection', beat.visual_direction");
    expect(sql).not.toMatch(/'sourceRange'|'spanSha256'|'passageId'/);
  });

  it("filters every public narrative level to published product lanes", () => {
    expect(sql.match(/publication_state = 'published'/g)?.length ?? 0).toBeGreaterThanOrEqual(7);
    expect(sql.match(/rights_lane in \('product_allowed', 'derivative_allowed'\)/g)?.length ?? 0).toBeGreaterThanOrEqual(7);
    expect(sql).toContain("language_filter in ('en', 'hi')");
    expect(sql).toContain("and exists (\n          select 1\n          from public.narrative_moments visible_moment");
  });
});
