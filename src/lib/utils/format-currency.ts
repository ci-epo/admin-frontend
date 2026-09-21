const CURRENCY = "FCFA";

/** Montant signé d'une opération : `+15 000 FCFA` / `-36 000 FCFA`. */
export function formatMontant(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString("fr-FR");
  return amount >= 0 ? `+${formatted} ${CURRENCY}` : `-${formatted} ${CURRENCY}`;
}

/** Solde de caisse, sans signe explicite : `255 000 FCFA`. */
export function formatSolde(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} ${CURRENCY}`;
}
