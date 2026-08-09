import { describe, expect, it } from "vitest";

import { answerSarthi } from "./answer";
import { answerGaneshaConnectedWorld, GANESHA_CONNECTED_WORLD_FIXITY } from "./ganesha-connected-world";

describe("Ganesha connected-world Sarthi continuity", () => {
  it.each([
    ["ganesha-cosmic-world", 5],
    ["ganesha-five-elements", 5],
    ["ganesha-one-tusked-form", 9],
    ["ganesha-mouse-emblem", 9],
    ["ganesha-eight-names", 10],
    ["ganesha-ekadanta", 10],
    ["ganesha-lambodara", 10],
    ["ganesha-vighnanashin", 10],
  ])("answers %s from exact Atharvashirsha unit %i", (atlasNodeSlug, sourceOrdinal) => {
    const result = answerSarthi({ message: "Tell me the story of this", context: { atlasNodeSlug } });
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    if (!result.ok) throw new Error(result.message);
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]).toMatchObject({
      sourceObjectId: "43d5f6ca8a2ee7d7a62480a85cdbd526cee04b816db46ac7c3fd8d90757a5178",
      sourceOrdinal,
      rightsLane: "derivative_allowed",
    });
  });

  it.each([
    "public-ganeshotsav-1893",
    "ganeshotsav-community-pandal",
    "ganeshotsav-clay-murti",
    "ganeshotsav-modak",
    "ganeshotsav-visarjan",
  ])("answers %s through the reviewed modern-festival boundary", (atlasNodeSlug) => {
    const result = answerGaneshaConnectedWorld({ message: "Tell me the story of this", context: { atlasNodeSlug } });
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    if (!result) throw new Error("Expected a connected-world answer");
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]).toMatchObject({ rightsLane: "citation_only" });
    expect(result.citations[0].quotation).toBeUndefined();
    expect(result.sourceBoundary).toContain("not establish a universal");
  });

  it("preserves the fixed 8 exact-source plus 5 modern-festival denominator", () => {
    expect(GANESHA_CONNECTED_WORLD_FIXITY).toMatchObject({
      exactSourceNodeCount: 8,
      modernFestivalNodeCount: 5,
      contentPackSha256: "eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd",
    });
  });
});
