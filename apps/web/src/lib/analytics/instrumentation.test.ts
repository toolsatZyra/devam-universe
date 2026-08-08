import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("launch funnel instrumentation", () => {
  it("covers the three product doors and their successful response boundaries", () => {
    const atlas = source("src/components/atlas/atlas-shell.tsx");
    const search = source("src/app/search/search-experience.tsx");
    const sarthi = source("src/components/sarthi/sarthi-conversation.tsx");
    expect(atlas).toContain('trackProductEvent("atlas_opened"');
    expect(atlas).toContain('trackProductEvent("atlas_gateway_opened", gatewayId)');
    expect(search).toContain('trackProductEvent("search_submitted")');
    expect(search).toContain('trackProductEvent("search_results_rendered"');
    expect(sarthi).toContain('trackProductEvent("sarthi_question_submitted", "standalone")');
    expect(sarthi).toContain('trackProductEvent("sarthi_answer_rendered"');
  });

  it("covers deterministic Today resolution and passwordless account conversion", () => {
    expect(source("src/components/today/today-experience.tsx")).toContain('trackProductEvent("today_resolved"');
    expect(source("src/app/account/account-forms.tsx")).toContain('trackProductEvent("account_sign_in_requested"');
    expect(source("src/app/account/account-analytics.tsx")).toContain('trackProductEvent("account_signed_in"');
  });
});
