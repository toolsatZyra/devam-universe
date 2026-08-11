import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";

describe("selected Dutt Uttara source-span manifest", () => {
  it("addresses the complete first unfinished turn without gaps or duplicate hashes", () => {
    const hashes = getDuttKandaSpanSha256s("uttara", 1, 45);
    expect(hashes).toHaveLength(45);
    expect(new Set(hashes).size).toBe(45);
    expect(hashes.every((hash) => /^[0-9a-f]{64}$/.test(hash))).toBe(true);
  });

  it("preserves independently re-derived boundary anchors", () => {
    expect(getDuttKandaSpanSha256s("uttara", 1, 1)[0]).toBe(
      "312e04ff802064883eaf043ff452c31eddec4200ad47a4fbfb79f2244b75be41",
    );
    expect(getDuttKandaSpanSha256s("uttara", 45, 45)[0]).toBe(
      "6ed6253e7289f04898dd4ffba449b0510d57dde09ef9213dc33ea5acf1cdfbc4",
    );
  });

  it("rejects incomplete or reversed requests beyond the mapped checkpoint", () => {
    expect(() => getDuttKandaSpanSha256s("uttara", 0, 1)).toThrow("Invalid");
    expect(() => getDuttKandaSpanSha256s("uttara", 6, 5)).toThrow("Invalid");
    expect(() => getDuttKandaSpanSha256s("uttara", 45, 46)).toThrow("Missing");
  });
});
