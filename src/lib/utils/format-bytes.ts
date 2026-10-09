const UNITS = ["o", "Ko", "Mo", "Go"] as const;

/** Taille lisible en unités binaires françaises : `512 o`, `1,5 Ko`, `12,3 Mo`. */
export function formatBytes(bytes: number): string {
  let value = Math.max(0, bytes);
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = unit === 0 || value >= 100 ? 0 : 1;
  return `${value.toLocaleString("fr-FR", { maximumFractionDigits: digits })} ${UNITS[unit]}`;
}
