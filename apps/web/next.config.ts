import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  outputFileTracingIncludes: {
    "/api/practice-guidance": ["../../knowledge_packs/ganesha/shriganapatimantraksharavali-v1.json"],
  },
};

export default nextConfig;
