/**
 * Une affectation est active tant que sa date de fin n'est pas dépassée (le jour de fin compris) ; la date de début
 * n'entre pas en compte. Comparaison de jours `YYYY-MM-DD` (pas d'heures), en UTC comme les dates de l'API.
 */
export function isOfficeAssignmentActive(endDate: string, now: Date = new Date()): boolean {
  return now.toISOString().slice(0, 10) <= endDate.slice(0, 10);
}
