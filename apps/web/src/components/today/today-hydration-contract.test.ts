import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Today hydration date contract", () => {
  it("serializes one server date for the first client render before syncing local time", () => {
    const page = readFileSync(resolve(process.cwd(), "src/app/today/page.tsx"), "utf8");
    const component = readFileSync(resolve(process.cwd(), "src/components/today/today-experience.tsx"), "utf8");

    expect(page).toContain("<TodayExperience initialDate={initialDate} />");
    expect(component).toContain("useState(initialDate)");
    expect(component).not.toContain("useState(localDateNow)");
    expect(component).toContain("setDate(localDate)");
  });
});
