import { isIsoDay, parseExportRange } from "@/lib/schemas/media-export.schema";

describe("période d'export des médias", () => {
  it("accepte des jours réels, début et fin pouvant être le même jour", () => {
    expect(parseExportRange("2026-01-01", "2026-06-30")).toEqual({ from: "2026-01-01", to: "2026-06-30" });
    expect(parseExportRange("2026-03-01", "2026-03-01")).not.toBeNull();
  });

  it("refuse un début après la fin, un jour inexistant ou un format libre", () => {
    expect(parseExportRange("2026-07-01", "2026-06-30")).toBeNull();
    expect(isIsoDay("2026-02-30")).toBe(false);
    expect(isIsoDay("01/03/2026")).toBe(false);
    expect(parseExportRange(null, "2026-06-30")).toBeNull();
    expect(parseExportRange("", "")).toBeNull();
  });
});
