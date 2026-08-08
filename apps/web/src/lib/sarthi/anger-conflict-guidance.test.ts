import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";

import { answerSarthiWithKnowledge } from "./grounded-answer";
import { ANGER_CONFLICT_PACK_SHA256, loadAngerConflictBundle } from "./anger-conflict-guidance";

describe("reviewed anger-conflict guidance", () => {
  sourceVaultIt("binds the exact reviewed bundle and all three fixed source spans", () => {
    const bundle = loadAngerConflictBundle();
    expect(ANGER_CONFLICT_PACK_SHA256).toBe("54271cfe77f35d0c82ccb8912b9858149fe92fef79aac5f2db38ebd9f0bbd05d");
    expect(bundle.principles.map((principle) => [principle.literal_marker, principle.source_ordinal])).toEqual([
      ["BhG 2.62-63", 91],
      ["BhG 6.5", 217],
      ["BhG 12.13-14", 444],
    ]);
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/e1/e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505"));
    for (const principle of bundle.principles) {
      const span = source.subarray(principle.byte_start, principle.byte_end_exclusive);
      expect(createHash("sha256").update(span).digest("hex")).toBe(principle.span_sha256);
      expect(span.toString("utf8")).toContain(principle.literal_marker);
    }
  });

  it("asks for safety and escalation context before applying a scripture lens", async () => {
    const result = await answerSarthiWithKnowledge({ message: "I keep getting angry with someone close to me. What should I do?", context: { languageCode: "en" } });
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    if (!result.ok) throw new Error("Expected context clarification");
    expect(result.followUpQuestion).toContain("immediate danger");
    expect(result.followUpQuestion).toContain("just before");
  });

  it("returns bounded English guidance only after safety and recurrence are explicit", async () => {
    const result = await answerSarthiWithKnowledge({
      message: "No one is in danger and everyone is safe. I keep losing my temper in the same family argument. Help me use the Gita without judging me.",
      context: { languageCode: "en" },
    });
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected reviewed guidance");
    expect(result.answer).toContain("warning map");
    expect(result.answer).toContain("does not mean self-blame");
    expect(result.answer).toContain("does not require agreement, access, or reconciliation");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([91, 217, 444]);
    expect(result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain(ANGER_CONFLICT_PACK_SHA256);
  });

  it("supports the same bounded route in Hindi", async () => {
    const result = await answerSarthiWithKnowledge({
      message: "कोई खतरे में नहीं है और सब सुरक्षित हैं। परिवार में उसी झगड़े पर बार-बार मुझे गुस्सा आ जाता है। गीता के आधार पर समझने में मदद करें।",
      context: { languageCode: "hi" },
    });
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance" });
    if (!result.ok) throw new Error("Expected reviewed Hindi guidance");
    expect(result.answer).toContain("चेतावनी-मानचित्र");
    expect(result.followUpQuestion).toContain("गुस्सा बढ़ने से ठीक पहले");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([91, 217, 444]);
  });

  it("routes imminent harm language to immediate safety before spiritual reflection", async () => {
    const result = await answerSarthiWithKnowledge({ message: "I am furious and might hurt someone right now.", context: { languageCode: "en" } });
    expect(result).toMatchObject({ ok: true, mode: "safety_escalation", citations: [] });
    if (!result.ok) throw new Error("Expected safety escalation");
    expect(result.answer).toContain("contact local emergency services");
  });
});
