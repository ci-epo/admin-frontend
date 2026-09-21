export interface PageSlice<T> {
  items: T[];
  /** Page effective (1-indexée), ramenée dans [1, totalPages]. */
  page: number;
  totalPages: number;
  /** Rang du premier élément affiché (0 si la liste est vide). */
  from: number;
  /** Rang du dernier élément affiché. */
  to: number;
  total: number;
}

export function paginate<T>(
  items: readonly T[],
  requestedPage: number,
  pageSize: number,
): PageSlice<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(page * pageSize, total),
    total,
  };
}
