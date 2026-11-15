/** Jour `AAAA-MM-JJ` réel (le 30 février n'existe pas). Mêmes règles que app-service. */
export function isIsoDay(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Période d'export : deux jours réels, le début ne suivant pas la fin. `null` : période invalide. */
export function parseExportRange(from: string | null, to: string | null): { from: string; to: string } | null {
  return isIsoDay(from) && isIsoDay(to) && from <= to ? { from, to } : null;
}
