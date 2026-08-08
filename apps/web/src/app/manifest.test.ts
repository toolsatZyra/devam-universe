import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("Devam PWA manifest", () => {
  it("defines an installable standalone shell with the real Devam mark", () => {
    const value = manifest();
    expect(value).toMatchObject({
      name: "Devam — The Living Atlas",
      short_name: "Devam",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#080b18",
      theme_color: "#080b18",
    });
    expect(value.icons).toEqual([{ src: "/brand/devam-mark.png", sizes: "1600x1600", type: "image/png", purpose: "any" }]);
  });
});
