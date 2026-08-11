import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDirectory = resolve(process.cwd(), "..", "..", "supabase", "migrations");
const migrationFile = readdirSync(migrationsDirectory).find((name) => name.endsWith("_add_consumer_narrative_model.sql"));
if (!migrationFile) throw new Error("Consumer narrative migration is missing.");
const sql = readFileSync(resolve(migrationsDirectory, migrationFile), "utf8");

const publicNarrativeTables = [...sql.matchAll(/create table public\.(narrative_[a-z_]+)/g)].map((match) => match[1]);
const rlsTables = [...sql.matchAll(/alter table public\.(narrative_[a-z_]+) enable row level security/g)].map((match) => match[1]);

describe("consumer narrative schema", () => {
  it("models one shared story projection from series through bilingual beats", () => {
    expect(publicNarrativeTables).toEqual([
      "narrative_series",
      "narrative_arcs",
      "narrative_arc_texts",
      "narrative_moments",
      "narrative_moment_texts",
      "narrative_beats",
      "narrative_beat_texts",
      "narrative_moment_entities",
      "narrative_moment_places",
      "narrative_moment_atlas_links",
      "narrative_moment_links",
      "narrative_evidence",
    ]);
    expect(sql).toContain("language_code in ('en', 'hi')");
    expect(sql).toContain("moment_kind in ('backbone_turn', 'playable_scene')");
    expect(sql).toContain("unique (series_id, backbone_ordinal, detail_ordinal)");
    expect(sql).toContain("unique (moment_id, beat_ordinal)");
  });

  it("enables RLS on every new public table", () => {
    expect(rlsTables.sort()).toEqual([...publicNarrativeTables].sort());
  });

  it("keeps exact narrative evidence out of browser grants", () => {
    const browserGrant = sql.match(/grant select on public\.narrative_series[\s\S]*?to anon, authenticated;/)?.[0] ?? "";
    expect(browserGrant).not.toContain("narrative_evidence");
    expect(sql).toContain("-- narrative_evidence intentionally has no browser policy or grant.");
  });

  it("publishes consumer rows only through product-compatible parents", () => {
    expect(sql).toContain("create policy narrative_series_product_read");
    expect(sql).toContain("create policy narrative_moments_product_read");
    expect(sql).toContain("create policy narrative_moment_atlas_links_product_read");
    expect(sql).toContain("create policy narrative_beat_texts_product_read");
    expect(sql.match(/rights_lane in \('product_allowed', 'derivative_allowed'\)/g)?.length ?? 0).toBeGreaterThanOrEqual(12);
  });

  it("contains no source payload or privileged function", () => {
    expect(sql).not.toMatch(/insert\s+into/i);
    expect(sql).not.toMatch(/security\s+definer/i);
    expect(sql).not.toMatch(/source_vault[\\/]+objects/i);
  });
});
