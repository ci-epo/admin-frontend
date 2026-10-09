import { isBackupName, parseBackupListDto } from "@/lib/schemas/backup.schema";

describe("isBackupName", () => {
  it("accepte un nom produit par app-service", () => {
    expect(isBackupName("cie-20260925-143012-pre-restore-Ab3_x-9Z.dump")).toBe(true);
  });

  it("rejette les chemins et les noms étrangers", () => {
    for (const name of ["../etc/passwd", "cie-20260925-143012-manual-abc.dump", "backup.sql", 42]) {
      expect(isBackupName(name)).toBe(false);
    }
  });
});

describe("parseBackupListDto", () => {
  it("retourne la liste typée", () => {
    const dto = [{ name: "cie-20260925-143012-manual-abcdefgh.dump", origin: "manual", createdAt: "2026-09-25T14:30:12.000Z", sizeBytes: 10 }];

    expect(parseBackupListDto(dto)).toEqual(dto);
  });

  it("rejette une réponse qui n'est pas une liste", () => {
    expect(() => parseBackupListDto({ data: [] })).toThrow(expect.objectContaining({ code: "SERVER_ERROR" }));
  });
});
