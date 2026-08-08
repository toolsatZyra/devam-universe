import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { answerSarthiWithKnowledge } from "./grounded-answer";
import { loadPersonalGuidanceBundle, PERSONAL_GUIDANCE_PACK_SHA256 } from "./personal-guidance";

describe("reviewed personal-guidance foundation", () => {
  it("loads the fixity-bound source and exact reviewed principle universe", () => {
    const bundle = loadPersonalGuidanceBundle();
    expect(PERSONAL_GUIDANCE_PACK_SHA256).toBe("423334be7bd4aa2d66129bf84894a60b6d7cb7b22ca1f9edee147f92d9d37eca");
    expect(bundle.principles.map((principle) => [principle.literal_marker, principle.source_ordinal])).toEqual([
      ["BhG 18.63", 620],
      ["BhG 2.47", 76],
      ["BhG 2.48", 77],
      ["BhG 17.15", 549],
    ]);
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/e1/e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505"));
    expect(source).toHaveLength(2056476);
    expect(createHash("sha256").update(source).digest("hex")).toBe("e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505");
    for (const principle of bundle.principles) {
      const span = source.subarray(principle.byte_start, principle.byte_end_exclusive);
      expect(createHash("sha256").update(span).digest("hex"), principle.principle_id).toBe(principle.span_sha256);
      expect(span.toString("utf8"), principle.principle_id).toContain(principle.literal_marker);
    }
  });

  it("turns a clarified money constraint into bounded, source-addressed English guidance", async () => {
    const result = await answerSarthiWithKnowledge({
      message: "Money and rent are the main worry.",
      context: { languageCode: "en" },
      recentTurns: [
        { role: "user", content: "My parents want one career, but I want a different path." },
        { role: "assistant", content: "Is financial dependence materially changing the decision?" },
      ],
    });
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected reviewed guidance");
    expect(result.answer).toContain("3–6 month financial need");
    expect(result.answer).toContain("do not choose a career for you");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([620, 76, 549]);
    expect(result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain(PERSONAL_GUIDANCE_PACK_SHA256);
  });

  it("provides the reviewed route in Hindi without quoting the private carrier", async () => {
    const result = await answerSarthiWithKnowledge({
      message: "पैसे और किराये की चिंता सबसे बड़ी है।",
      context: { languageCode: "hi" },
      recentTurns: [{ role: "user", content: "मेरे माता-पिता और मेरी करियर को लेकर अलग राय है।" }],
    });
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance" });
    if (!result.ok) throw new Error("Expected reviewed Hindi guidance");
    expect(result.answer).toContain("3–6 महीनों");
    expect(result.followUpQuestion).toContain("मासिक जरूरत");
    expect(result.citations.every((citation) => citation.quotation === undefined)).toBe(true);
  });

  it("does not repeat a clarification when one message already supplies the material context", async () => {
    const result = await answerSarthiWithKnowledge({
      message: "I am financially independent, no one is in danger, and my parents fear instability. Help me compare two reversible next steps through an attributable Indian wisdom lens.",
      context: { languageCode: "en" },
    });
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance" });
    if (!result.ok) throw new Error("Expected reviewed standalone guidance");
    expect(result.answer).toContain("important counsel, not an automatic veto");
    expect(result.answer).toContain("cost, learning value, time limit, and fallback");
    expect(result.followUpQuestion).toContain("two reversible steps");
  });
});
