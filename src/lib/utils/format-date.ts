/**
 * Fuseau fixe (celui du club) : le serveur et le navigateur produisent le même texte, sans écart à l'hydratation.
 * Burkina Faso = UTC+0, sans heure d'été.
 */
const DATE_TIME = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Ouagadougou",
});

const DATE_ONLY = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeZone: "Africa/Ouagadougou",
});

/** `25/09/2026 14:30` */
export function formatDateTime(date: Date): string {
  return DATE_TIME.format(date);
}

/** `25/09/2026` */
export function formatDate(date: Date): string {
  return DATE_ONLY.format(date);
}
