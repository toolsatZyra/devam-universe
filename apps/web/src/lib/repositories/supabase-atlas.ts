import "server-only";
import type { AtlasRepository } from "./atlas";
import { mapAtlasRows } from "./atlas-row-mapper";
import type { AtlasWorld } from "@/lib/domain/atlas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export class SupabaseAtlasRepository implements AtlasRepository {
  async getWorld(): Promise<AtlasWorld> {
    const supabase = createServerSupabaseClient();
    const [nodesResult, edgesResult] = await Promise.all([
      supabase.from("atlas_nodes").select("id,slug,title,subtitle,node_kind,is_gateway,position,visual,reveal_at").order("slug"),
      supabase.from("atlas_edges").select("id,source_node_id,target_node_id,label,visual").order("label"),
    ]);
    if (nodesResult.error) throw new Error(`Could not load Atlas nodes: ${nodesResult.error.message}`);
    if (edgesResult.error) throw new Error(`Could not load Atlas edges: ${edgesResult.error.message}`);
    return mapAtlasRows(nodesResult.data, edgesResult.data);
  }
}
