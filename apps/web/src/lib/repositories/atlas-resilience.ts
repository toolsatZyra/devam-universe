import type { AtlasWorld } from "@/lib/domain/atlas";

interface AtlasWorldSource {
  getWorld(): Promise<AtlasWorld>;
}

export class ResilientAtlasRepository implements AtlasWorldSource {
  constructor(
    private readonly primary: AtlasWorldSource,
    private readonly reviewedFallback: AtlasWorldSource,
  ) {}

  async getWorld(): Promise<AtlasWorld> {
    try {
      return await this.primary.getWorld();
    } catch (error) {
      console.warn("[atlas] Hosted projection rejected; using the reviewed local universe.", {
        error: error instanceof Error ? error.message : String(error),
      });
      return this.reviewedFallback.getWorld();
    }
  }
}
