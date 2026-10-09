import { asObject, invalidResponse, readNumber } from "@/lib/schemas/guards";

/** Ne lit que `total` d'une réponse paginée : la page du dashboard n'a besoin que du compte. */
export function readPaginatedTotal(value: unknown, what: string): number {
  return readNumber(asObject(value, what), "total", what);
}

export interface AccountListPageDto {
  totalPages: number;
  balances: number[];
}

/** Solde de chaque compte d'une page de `GET /accounts` (pour en faire la somme). */
export function parseAccountListPageDto(value: unknown, what: string): AccountListPageDto {
  const source = asObject(value, what);
  const dataRaw = source.data;
  if (!Array.isArray(dataRaw)) throw invalidResponse(`${what}.data`, dataRaw);
  return {
    totalPages: readNumber(source, "totalPages", what),
    balances: dataRaw.map((item) => readNumber(asObject(item, `${what}.data[]`), "balance", `${what}.data[]`)),
  };
}
