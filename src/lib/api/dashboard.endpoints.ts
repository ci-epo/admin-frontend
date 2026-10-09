import { apiClient } from "@/lib/api/client";
import { parseAccountListPageDto, readPaginatedTotal } from "@/lib/schemas/dashboard.schema";

const ACCOUNTS_PAGE_LIMIT = 100;

export async function getMembersTotal(): Promise<number> {
  const dto = await apiClient<unknown>({ path: "/members?page=1&limit=1", method: "GET", cache: "no-store" });
  return readPaginatedTotal(dto, "members");
}

export interface ProjectsTotals {
  total: number;
  public: number;
}

export async function getProjectsTotals(): Promise<ProjectsTotals> {
  const [all, publicOnly] = await Promise.all([
    apiClient<unknown>({ path: "/projects?page=1&limit=1", method: "GET", cache: "no-store" }),
    apiClient<unknown>({ path: "/projects?page=1&limit=1&isPublic=true", method: "GET", cache: "no-store" }),
  ]);
  return { total: readPaginatedTotal(all, "projects"), public: readPaginatedTotal(publicOnly, "projects") };
}

/** Solde de la caisse : somme du solde de tous les comptes (rarement plus d'une page). */
export async function getTreasuryBalance(): Promise<number> {
  const first = parseAccountListPageDto(
    await apiClient<unknown>({
      path: `/accounts?page=1&limit=${ACCOUNTS_PAGE_LIMIT}`,
      method: "GET",
      cache: "no-store",
    }),
    "accounts",
  );

  const restPages = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, index) =>
      apiClient<unknown>({
        path: `/accounts?page=${index + 2}&limit=${ACCOUNTS_PAGE_LIMIT}`,
        method: "GET",
        cache: "no-store",
      }).then((dto) => parseAccountListPageDto(dto, "accounts").balances),
    ),
  );

  return [first.balances, ...restPages].flat().reduce((sum, balance) => sum + balance, 0);
}
