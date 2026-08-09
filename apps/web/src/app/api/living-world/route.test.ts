import { describe, expect, it } from "vitest";
import { GET } from "./route";

const laneHashes = {
  "west-india-lakshmi-puja": "f084c0355b1706831058e54586b8b2c782b0c24ae3f724de9494ff3c0f5d6f4f",
  "bengal-kali-puja": "11cc811ae40c803ac8b3816b156fdc957f87fafcd59fc428119a8f1a7e02ac67",
  "tamil-deepavali": "ec0df3a2f4ae3817d1db145618e3500f202011303534bd3cc3a7a928a4476323",
};

describe("GET /api/living-world", () => {
  it.each(["en", "hi"] as const)("returns one localized, source-hashed Diwali world in %s", async (languageCode) => {
    const response = await GET(new Request(`http://localhost/api/living-world?nodeId=diwali&languageCode=${languageCode}`));
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=86400");
    expect(result).toMatchObject({ ok: true, portal: { nodeId: "diwali", languageCode } });
    expect(result.portal.lanes.map((lane: { id: string; nodeId: string; crop: string }) => ({ id: lane.id, nodeId: lane.nodeId, crop: lane.crop }))).toEqual([
      { id: "west-india-lakshmi-puja", nodeId: "lakshmi-puja", crop: "left" },
      { id: "bengal-kali-puja", nodeId: "kali-puja", crop: "centre" },
      { id: "tamil-deepavali", nodeId: "tamil-deepavali", crop: "right" },
    ]);
    for (const lane of result.portal.lanes as { id: keyof typeof laneHashes; title: string; significance: string; originStory: string; typicalPractices: string[]; minimumForm: { steps: string[] }; evidence: { packFileSha256: string; sourceCount: number } }[]) {
      expect(lane.title.length, lane.id).toBeGreaterThan(8);
      expect(lane.significance.length, lane.id).toBeGreaterThan(40);
      expect(lane.originStory.length, lane.id).toBeGreaterThan(40);
      expect(lane.typicalPractices.length, lane.id).toBeGreaterThan(0);
      expect(lane.minimumForm.steps.length, lane.id).toBeGreaterThan(0);
      expect(lane.evidence.packFileSha256, lane.id).toBe(laneHashes[lane.id]);
      expect(lane.evidence.sourceCount, lane.id).toBeGreaterThanOrEqual(3);
    }
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("required_text");
    expect(serialized).not.toContain("source_text");
    expect(serialized).not.toContain("sourceText");
  });

  it("fails closed for unsupported nodes and malformed language context", async () => {
    expect((await GET(new Request("http://localhost/api/living-world?nodeId=ramayana&languageCode=en"))).status).toBe(404);
    expect((await GET(new Request("http://localhost/api/living-world?nodeId=diwali&languageCode=sa"))).status).toBe(422);
    expect((await GET(new Request("http://localhost/api/living-world?languageCode=en"))).status).toBe(422);
  });
});
