import { useState } from "react";
import { paginate, type PageSlice } from "@/lib/utils/pagination";

interface UsePaginationResult<T> extends PageSlice<T> {
  setPage: (page: number) => void;
}

/** Pagination locale d'une liste déjà chargée. La page effective est dérivée, jamais stockée en double. */
export function usePagination<T>(
  items: readonly T[],
  pageSize: number,
): UsePaginationResult<T> {
  const [requestedPage, setPage] = useState(1);

  return { ...paginate(items, requestedPage, pageSize), setPage };
}
