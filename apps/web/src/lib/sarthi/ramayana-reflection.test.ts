import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";

import {
  answerReviewedRamayanaReflection,
  loadRamayanaReflectionBundle,
  RAMAYANA_REFLECTION_PACK_SHA256,
  searchReviewedRamayanaReflection,
} from "./ramayana-reflection";

function sha256(value: Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

describe("reviewed Ramayana reflection", () => {
  sourceVaultIt("pins the bundle, complete three-source universe, exact source objects, byte spans and Dutt page evidence", () => {
    const root = resolve(process.cwd(), "../..");
    const pack = readFileSync(resolve(root, "knowledge_packs/ramayana/sundarakanda-hanuman-deliberation-v1.json"));
    expect(sha256(pack)).toBe(RAMAYANA_REFLECTION_PACK_SHA256);
    const bundle = loadRamayanaReflectionBundle();
    expect(bundle.sources).toHaveLength(3);
    expect(bundle.passages).toHaveLength(3);
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    for (const source of bundle.sources) {
      const bytes = readFileSync(resolve(root, source.source_path));
      expect(bytes).toHaveLength(source.byte_count);
      expect(sha256(bytes)).toBe(source.sha256);
      const passage = bundle.passages.find((candidate) => candidate.source_id === source.source_id)!;
      expect(passage).toBeDefined();
      if ("byte_start" in passage) {
        expect(sha256(bytes.subarray(passage.byte_start, passage.byte_end_exclusive))).toBe(passage.span_sha256);
      }
    }
    const gretil = readFileSync(resolve(root, bundle.sources[0].source_path));
    const griffith = readFileSync(resolve(root, bundle.sources[1].source_path));
    for (const row of bundle.crosswalk.adjacent_sequence_check) {
      expect(sha256(gretil.subarray(row.gretil_evidence.byte_start, row.gretil_evidence.byte_end_exclusive))).toBe(row.gretil_evidence.span_sha256);
      expect(sha256(griffith.subarray(row.griffith_evidence.byte_start, row.griffith_evidence.byte_end_exclusive))).toBe(row.griffith_evidence.span_sha256);
    }
    const primaryPassage = bundle.passages[0];
    const translationPassage = bundle.passages[1];
    if (!("byte_start" in primaryPassage) || !("byte_start" in translationPassage)) throw new Error("Expected byte-addressed TEI passages");
    const primary = gretil.subarray(primaryPassage.byte_start, primaryPassage.byte_end_exclusive).toString("utf8");
    const translation = griffith.subarray(translationPassage.byte_start, translationPassage.byte_end_exclusive).toString("utf8");
    expect(primary).toContain("vācaṃ codāhariṣyāmi mānuṣīm iha saṃskṛtām");
    expect(primary).toContain("nainām udvejayiṣyāmi");
    expect(translation).toContain("Canto XXX. Hanumán's Deliberation");
    expect(translation).toContain("First I will utter Ráma's name");

    const selectedReview = readFileSync(resolve(root, "ingestion/reports/ramayana-manmatha-nath-dutt-sundara-selected-passage-v1.json"));
    expect(sha256(selectedReview)).toBe("f506d39d6c9e3cd90c5f6629ecd64c050b59e51dfeb372fbaa8c717d902c268b");
    const review = JSON.parse(selectedReview.toString("utf8")) as { source: { sha256: string }; pages: Array<{ carrier_page_1_based: number; provider_ocr_sha256: string }>; claims: Record<string, boolean> };
    expect(review.source.sha256).toBe(bundle.sources[2].sha256);
    expect(review.pages.map((page) => page.carrier_page_1_based)).toEqual([110, 111, 112, 113, 114, 115]);
    expect(review.claims.provider_ocr_verified_or_servable_as_exact_text).toBe(false);
    const structure = JSON.parse(readFileSync(resolve(root, "ingestion/reports/ramayana-manmatha-nath-dutt-commons-structure-v1.json"), "utf8")) as { volumes: Array<{ volume_ordinal: number; page_records: Array<{ text_sha256: string }> }> };
    const sundara = structure.volumes.find((volume) => volume.volume_ordinal === 5)!;
    for (const page of review.pages) expect(sundara.page_records[page.carrier_page_1_based - 1].text_sha256).toBe(page.provider_ocr_sha256);
  });

  it("preserves the 5.28 versus XXX numbering divergence and triangulates the next two episodes", () => {
    const crosswalk = loadRamayanaReflectionBundle().crosswalk;
    expect(crosswalk).toMatchObject({
      status: "content_sequence_alignment_with_literal_numbering_divergence",
      gretil_locator: "Book 5, sarga 28",
      griffith_locator: "Book 5, Canto XXX",
    });
    expect(crosswalk.adjacent_sequence_check.map((row) => [row.gretil, row.griffith])).toEqual([
      ["5.28", "XXX"], ["5.29", "XXXI"], ["5.30", "XXXII"],
    ]);
  });

  it("answers in English and Hindi without exposing either private source text", () => {
    const english = answerReviewedRamayanaReflection({ message: "How can Hanuman's deliberation before speaking to Sita help me prepare for a difficult conversation?" });
    expect(english).toMatchObject({ ok: true, mode: "reviewed_ramayana_reflection", alternativesAvailable: true });
    expect(english?.citations.map((citation) => citation.sourceOrdinal)).toEqual([352, 367, 30]);
    expect(english?.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(english?.answer).toContain("smallest truthful step");
    expect(english?.sourceBoundary).toContain("sarga 28 with Griffith Canto XXX and visually reviewed Dutt Section XXX");

    const hindi = answerReviewedRamayanaReflection({ message: "सीता से बोलने से पहले हनुमान ने क्या विचार किया?", context: { languageCode: "hi" } });
    expect(hindi).toMatchObject({ ok: true, mode: "reviewed_ramayana_reflection" });
    expect(hindi?.answer).toContain("विश्वास");
  });

  it("returns one exact-plus-interpretive search lane and leaves generic Ramayana queries alone", () => {
    const result = searchReviewedRamayanaReflection("Ramayana Hanuman's deliberation before speaking to Sita", "en");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ claimKind: "reviewed_interpretive_lens", languageCode: "en" });
    expect(result[0].citations).toHaveLength(3);
    expect(searchReviewedRamayanaReflection("seven books of the Ramayana", "en")).toEqual([]);
  });
});
