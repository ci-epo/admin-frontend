import { parseUpdateOfficeAssignmentForm } from "@/lib/schemas/office-assignment.schema";

const formOf = (values: Record<string, string>) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
};

const valid = { positionId: "pos123", mandateId: "man123", beginDate: "2025-09-01", endDate: "2026-08-31" };

describe("parseUpdateOfficeAssignmentForm", () => {
  it("retourne poste, mandat et dates sans membre", () => {
    const result = parseUpdateOfficeAssignmentForm(formOf({ ...valid, memberId: "ignored" }));
    expect(result).toEqual({ ok: true, data: valid });
  });

  it("refuse une fin antérieure au début", () => {
    const result = parseUpdateOfficeAssignmentForm(formOf({ ...valid, endDate: "2025-01-01" }));
    expect(result).toMatchObject({ ok: false, fieldErrors: { endDate: expect.stringContaining("après") } });
  });

  it("signale les champs vides sans exiger de membre", () => {
    const result = parseUpdateOfficeAssignmentForm(formOf({ ...valid, positionId: "", mandateId: "" }));
    expect(result).toMatchObject({
      ok: false,
      fieldErrors: { positionId: expect.any(String), mandateId: expect.any(String) },
    });
    expect(result).toMatchObject({ fieldErrors: expect.not.objectContaining({ memberId: expect.anything() }) });
  });
});
