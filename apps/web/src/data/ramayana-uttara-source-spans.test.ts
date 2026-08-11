import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";

describe("selected Dutt Uttara source-span manifest", () => {
  it("retains the complete first Uttara turn without gaps or duplicate hashes", () => {
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
    expect(getDuttKandaSpanSha256s("uttara", 46, 53)).toEqual([
      "6d10d1bc4ec409d02d49a520043ac73546b368247626d23572acb9dd00989897",
      "26a011cb896f85df9804c7a4f61bef296554c54eb13a10a62d42071013af6cfd",
      "291a91ae85e35932a49f155dd5c64dac5804a0f5fe4dcf211698e5ff90490597",
      "f9a754d8d21b8a74dee2f66a91c4a0f6baa17900c68b933ac2db7138b78fd449",
      "4826e2ce0c62bbebb6d385f9c8bb34cd406effc4c0accd9224bed343240a4456",
      "7c9bae6762404b3064e8073ab91027d3b22815ff6cc618924a8d06246e6c63e5",
      "76fad8bfe054565027454dac476f0472c5ea68c0291c85ba2c5c369f76203356",
      "158cd495584204dd9e4970e2c953457d5f994d005f7c1d55724aff0f81b74f79",
    ]);
    expect(getDuttKandaSpanSha256s("uttara", 54, 61)).toEqual([
      "fad310fd7914d26b668001ed09ae360a9b3b21adc94b50334039dd1ed7d9d093",
      "01ada302a35f973e501ce2f511dc58d6800c3fac9712b976560821cfde7a48ac",
      "fd7f6ea99990d8b604c95a814f5136af6174c96cd5a6497232de1841964956ed",
      "ca365d69b2bd4fce3aed56084677197b0c1618272edf803b83b5435191cc090c",
      "9216502985368b591b7fee2c0854c62bf96310a48e91187a68672ad185ebfaa4",
      "d4917dc5baf1f84d4db3ce90b66e0bcbf3fa57ed2287ab3b75966544d1aeb243",
      "a1fb3f17be99ce62b4b805d97bf5b417956474a428e1323e8a869da0193e3682",
      "ec1262922e35d5ff4637127b51dd769023c9a55f9ef0fc3f2cc6d7f3195ca742",
    ]);
  });

  it("rejects incomplete or reversed requests beyond the mapped checkpoint", () => {
    expect(() => getDuttKandaSpanSha256s("uttara", 0, 1)).toThrow("Invalid");
    expect(() => getDuttKandaSpanSha256s("uttara", 6, 5)).toThrow("Invalid");
    expect(() => getDuttKandaSpanSha256s("uttara", 61, 62)).toThrow("Missing");
  });
});
