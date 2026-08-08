import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  outputFileTracingIncludes: {
    "/*": [
      "../../knowledge_packs/**/*.json",
      "../../ingestion/plans/**/*.json",
      "../../ingestion/reports/**/*.json",
    ],
  },
};

export default nextConfig;
