import { describe, expect, it } from "vitest";
import {
  DUTT_BALA_SECTION_SPAN_SHA256,
  DUTT_BALA_SOURCE_SHA256,
  getDuttBalaSpanSha256s,
} from "./ramayana-bala-source-spans";

describe("selected Dutt Balakanda source-span manifest", () => {
  it("addresses all 75 retained sections without gaps or duplicate hashes", () => {
    expect(DUTT_BALA_SOURCE_SHA256).toMatch(/^[0-9a-f]{64}$/);
    expect(Object.keys(DUTT_BALA_SECTION_SPAN_SHA256).map(Number)).toEqual(
      Array.from({ length: 75 }, (_, index) => index + 1),
    );
    const hashes = getDuttBalaSpanSha256s(1, 75);
    expect(hashes).toHaveLength(75);
    expect(new Set(hashes).size).toBe(75);
    expect(hashes.every((hash) => /^[0-9a-f]{64}$/.test(hash))).toBe(true);
  });

  it("preserves independently re-derived boundary anchors", () => {
    expect(getDuttBalaSpanSha256s(1, 1)[0]).toBe("8826f86d98ee489289a4e21fe3ebd254109e779a7b16be9381190312ce013ec9");
    expect(getDuttBalaSpanSha256s(75, 75)[0]).toBe("f598809b0283cb033e5aab6aa73bd8f6f62dbc84137e4070707d447706413026");
  });

  it("rejects out-of-range or reversed requests", () => {
    expect(() => getDuttBalaSpanSha256s(0, 1)).toThrow("Invalid");
    expect(() => getDuttBalaSpanSha256s(4, 3)).toThrow("Invalid");
    expect(() => getDuttBalaSpanSha256s(75, 76)).toThrow("Invalid");
  });
});
