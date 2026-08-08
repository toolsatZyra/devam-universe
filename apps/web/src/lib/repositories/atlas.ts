import type { AtlasWorld } from "@/lib/domain/atlas";
import { eras, gateways, placeThreads, worldEdges, worldNodes } from "@/data/atlas";
import { SupabaseAtlasRepository } from "@/lib/repositories/supabase-atlas";
import { ResilientAtlasRepository } from "@/lib/repositories/atlas-resilience";
import { hasSupabaseConfiguration } from "@/lib/supabase/server";

export interface AtlasRepository {
  getWorld(): Promise<AtlasWorld>;
}

class FixtureAtlasRepository implements AtlasRepository {
  async getWorld(): Promise<AtlasWorld> {
    return { eras, gateways, placeThreads, worldEdges, worldNodes };
  }
}

// This is the only composition point the page knows about. The Supabase-backed
// implementation owns published node topology when configured. Its rows must
// pass the strict mapper; a stale or invalid projection falls back as a whole
// to the reviewed local universe instead of mixing database and local rows.
export function getAtlasRepository(): AtlasRepository {
  if (process.env.DEVAM_ATLAS_FIXTURE === "1") {
    return new FixtureAtlasRepository();
  }
  if (hasSupabaseConfiguration()) {
    return new ResilientAtlasRepository(
      new SupabaseAtlasRepository(),
      new FixtureAtlasRepository(),
    );
  }
  return new FixtureAtlasRepository();
}
