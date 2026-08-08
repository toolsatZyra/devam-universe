import { describe, expect, it } from "vitest";
import { isRetrievableRightsLane, normalizeEvidenceQuery, normalizeLanguageCode } from "./contracts";

describe("evidence contracts", () => {
  it("normalizes a concise retrieval query", () => {
    expect(normalizeEvidenceQuery("  Ganesha   mantra  ")).toBe("Ganesha mantra");
  });

  it("rejects empty and unbounded retrieval queries", () => {
    expect(() => normalizeEvidenceQuery(" ")).toThrow(/at least two/);
    expect(() => normalizeEvidenceQuery("x".repeat(513))).toThrow(/512/);
  });

  it("never treats private evidence as a retrievable rights lane", () => {
    expect(isRetrievableRightsLane("derivative_allowed")).toBe(true);
    expect(isRetrievableRightsLane("private_evidence")).toBe(false);
  });

  it("normalizes bounded language tags", () => {
    expect(normalizeLanguageCode(" HI ")).toBe("hi");
    expect(normalizeLanguageCode("en-IN")).toBe("en-in");
    expect(normalizeLanguageCode(undefined)).toBeUndefined();
    expect(() => normalizeLanguageCode("not a language")).toThrow("Invalid language code");
  });
});
