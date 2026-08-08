import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { resolvePracticeGuidance } from "./practice-guidance";

describe("practice guidance routing architecture", () => {
  it("routes current content through the generic contract before legacy compatibility", () => {
    const result = resolvePracticeGuidance({
      observanceSlug: "ganesh-chaturthi",
      languageCode: "en",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
    });
    expect(result).toMatchObject({
      ok: true,
      status: "ritual_procedure_available",
      guide: {
        kind: "user_complete_observance_lane",
        evidence: { packId: "ganesh-chaturthi-west-india-content-v1" },
      },
    });
  });

  it("forbids reintroducing per-observance resolver branching", () => {
    const source = readFileSync(resolve(process.cwd(), "src/lib/practice/practice-guidance.ts"), "utf8");
    expect(source).toContain("DEVAM_RITUAL_OBSERVANCE_CONTENT_V1");
    expect(source.indexOf("resolveUserCompleteRitualContent(request)")).toBeLessThan(source.indexOf("for (const resolveLegacyProcedure"));
    expect(source.match(/const\s+\w+\s*=\s*resolve\w+Procedure\(request(?:,[^)]+)?\)/g)).toEqual([
      "const guide = resolveLegacyProcedure(request)",
      "const procedure = resolveGaneshChaturthiProcedure(request, companionReading)",
    ]);
    expect(source.match(/for \(const resolveLegacyProcedure/g)).toHaveLength(1);
  });

  it("continues to fail closed when no generic or compatibility lane matches", () => {
    expect(resolvePracticeGuidance({
      observanceSlug: "ganesh-chaturthi",
      languageCode: "en",
      regionCode: "bengal",
      traditionCode: "shakta-bengal",
    })).toMatchObject({ ok: true, status: "no_supported_guide_for_context", guide: null });
  });
});
