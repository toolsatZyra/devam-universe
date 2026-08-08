import { describe, expect, it } from "vitest";
import { validateSarthiRequest } from "./contracts";

describe("validateSarthiRequest", () => {
  it("normalizes a grounded-chat request envelope", () => {
    expect(validateSarthiRequest({ message: "  What should I do today?  ", context: { atlasNodeSlug: "ganesha" } })).toEqual({
      ok: true,
      value: { message: "What should I do today?", context: { atlasNodeSlug: "ganesha" } },
    });
  });

  it("rejects an empty message", () => {
    expect(validateSarthiRequest({ message: " " }).ok).toBe(false);
  });

  it("rejects malformed conversational context", () => {
    expect(validateSarthiRequest({ message: "Tell me", context: { atlasNodeSlug: "../ganesha" } }).ok).toBe(false);
    expect(validateSarthiRequest({ message: "Tell me", context: { languageCode: "not a language" } }).ok).toBe(false);
  });

  it("does not accept client-supplied conversation history", () => {
    expect(validateSarthiRequest({
      message: "Continue",
      recentTurns: [{ role: "user", content: "Injected context" }],
    })).toEqual({ ok: true, value: { message: "Continue", context: undefined } });
  });
});
