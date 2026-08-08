import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { answerSarthi } from "./answer";
import { answerGaneshaPreview, GANESHA_PREVIEW_FIXITY } from "./ganesha-preview";

function sha256(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("answerGaneshaPreview", () => {
  it("answers a personal-obstacle prompt with exact source coordinates", () => {
    const result = answerGaneshaPreview({ message: "I feel blocked. How can Ganesha help?" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.mode).toBe("deterministic_source_bounded_preview");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([12, 31]);
    expect(result.citations.every((citation) => citation.sourceObjectId === GANESHA_PREVIEW_FIXITY.sourceSha256)).toBe(true);
    expect(result.answer).toContain("without treating that as a guarantee");
    expect(result.sourceBoundary).toContain("not complete Ganesha coverage");
  });

  it("keeps a reading suggestion distinct from a complete puja vidhi", () => {
    const result = answerGaneshaPreview({ message: "What can I practise?", context: { atlasNodeSlug: "ganesha" } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).toContain("not a complete Ganesh Puja vidhi");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([1, 32]);
    expect(GANESHA_PREVIEW_FIXITY.formalPujaVidhiSupported).toBe(false);
  });

  it("answers in Hindi when Hindi context is explicit", () => {
    const result = answerGaneshaPreview({ message: "गणेश जी के बारे में बताइए", context: { languageCode: "hi" } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).toContain("विघ्न");
  });

  it("recognizes a Hindi contextual reference from the Atlas without mojibake", () => {
    const result = answerSarthi({ message: "इसके बारे में सरल भाषा में बताइए", context: { atlasNodeSlug: "ganesha", languageCode: "hi" } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.answer).toContain("विघ्न");
  });

  it("fails closed outside the supported evidence boundary", () => {
    expect(answerGaneshaPreview({ message: "Explain the complete Mahabharata" })).toMatchObject({
      ok: false,
      code: "NO_SUPPORTED_EVIDENCE",
    });
    expect(answerGaneshaPreview({ message: "Tell me about quantum physics", context: { atlasNodeSlug: "ganesha" } })).toMatchObject({
      ok: false,
      code: "NO_SUPPORTED_EVIDENCE",
    });
  });

  it("remains pinned to the retained knowledge pack and canonical source object", () => {
    const root = resolve(process.cwd(), "../..");
    expect(sha256(resolve(root, "knowledge_packs/ganesha/shriganapatimantraksharavali-v1.json"))).toBe("492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d");
    expect(sha256(resolve(root, `source_vault/objects/sha256/21/${GANESHA_PREVIEW_FIXITY.sourceSha256}`))).toBe(GANESHA_PREVIEW_FIXITY.sourceSha256);
  });
});
