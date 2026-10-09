import { isSessionRejected, toAdministrationErrorMessage } from "@/lib/mappers/administration-error.mapper";
import type { ApiError } from "@/types/api";

const apiError = (overrides: Partial<ApiError>): ApiError => ({
  status: 400,
  code: "BAD_REQUEST",
  message: "x",
  ...overrides,
});

describe("toAdministrationErrorMessage", () => {
  it("traduit un code métier connu", () => {
    const error = apiError({ status: 409, code: "CONFLICT", apiCode: "BACKUP_OPERATION_IN_PROGRESS" });

    expect(toAdministrationErrorMessage(error)).toMatch(/opération .* en cours/);
  });

  it("cite la sauvegarde de sécurité quand une restauration échoue", () => {
    const error = apiError({
      status: 500,
      code: "SERVER_ERROR",
      apiCode: "BACKUP_RESTORE_FAILED",
      details: { metadata: { safetyBackup: "cie-20260925-143012-pre-restore-abcdefgh.dump" } },
    });

    expect(toAdministrationErrorMessage(error)).toContain("cie-20260925-143012-pre-restore-abcdefgh.dump");
  });

  it("signale une API injoignable", () => {
    expect(toAdministrationErrorMessage(apiError({ status: 0, code: "NETWORK_ERROR" }))).toMatch(/injoignable/);
  });

  it("reste générique pour une erreur inconnue", () => {
    expect(toAdministrationErrorMessage(new Error("boom"))).toBe("L'opération a échoué. Réessayez dans un instant.");
  });
});

describe("isSessionRejected", () => {
  it("reconnaît une session expirée/invalide, pas un refus de permission", () => {
    expect(isSessionRejected(apiError({ status: 401, apiCode: "AUTH_TOKEN_INVALID" }))).toBe(true);
    expect(isSessionRejected(apiError({ status: 401, apiCode: "AUTH_TOKEN_REQUIRED" }))).toBe(true);
    expect(isSessionRejected(apiError({ status: 403, apiCode: "PERMISSION_DENIED" }))).toBe(false);
  });
});
