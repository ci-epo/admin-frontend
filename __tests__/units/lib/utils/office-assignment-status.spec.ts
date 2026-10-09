import { isOfficeAssignmentActive } from "@/lib/utils/office-assignment-status";

describe("isOfficeAssignmentActive", () => {
  const today = new Date("2026-10-09T15:30:00Z");

  it("est active tant que la date de fin n'est pas dépassée, y compris le jour même", () => {
    expect(isOfficeAssignmentActive("2026-10-10", today)).toBe(true);
    expect(isOfficeAssignmentActive("2026-10-09", today)).toBe(true);
    expect(isOfficeAssignmentActive("2026-10-09T00:00:00.000Z", today)).toBe(true);
  });

  it("est inactive une fois la date de fin dépassée", () => {
    expect(isOfficeAssignmentActive("2026-10-08", today)).toBe(false);
    expect(isOfficeAssignmentActive("2026-08-31T00:00:00.000Z", today)).toBe(false);
  });
});
