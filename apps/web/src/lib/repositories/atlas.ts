import type { AtlasWorld } from "@/lib/domain/atlas";
import { eras, gateways, placeThreads, worldEdges, worldNodes } from "@/data/atlas";
import { SupabaseAtlasRepository } from "@/lib/repositories/supabase-atlas";
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
// implementation owns published node topology when configured; reviewed local
// exploration copy remains a fail-safe for legacy rows until its migration is applied.
export function getAtlasRepository(): AtlasRepository {
  if (process.env.DEVAM_ATLAS_FIXTURE === "1") {
    return new FixtureAtlasRepository();
  }
  if (hasSupabaseConfiguration()) {
    return new SupabaseAtlasRepository();
  }
  return new FixtureAtlasRepository();
}
