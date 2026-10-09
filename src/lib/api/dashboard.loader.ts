import { getMembersTotal, getProjectsTotals, getTreasuryBalance } from "@/lib/api/dashboard.endpoints";
import { formatSolde } from "@/lib/utils/format-currency";
import type { StatItem } from "@/types/stat";

/** Carte affichée à la place d'une statistique dont l'API n'a pas répondu (le dashboard reste utilisable). */
function unavailableStat(icon: string, label: string): StatItem {
  return { icon, value: "—", label, caption: "Indisponible", highlightColor: "danger", trend: "none" };
}

/**
 * Statistiques réelles du dashboard (app-service). Chaque carte est chargée indépendamment : l'échec d'une
 * n'empêche pas d'afficher les autres.
 */
export async function loadDashboardStats(): Promise<StatItem[]> {
  const [members, projects, treasury] = await Promise.all([
    getMembersTotal()
      .then((total): StatItem => ({
        icon: "bi bi-people-fill",
        value: total.toLocaleString("fr-FR"),
        label: "Total membres",
        trend: "none",
      }))
      .catch((error) => {
        console.warn("[dashboard] total membres indisponible", error);
        return unavailableStat("bi bi-people-fill", "Total membres");
      }),
    getProjectsTotals()
      .then(({ total, public: publicCount }): StatItem => ({
        icon: "bi bi-kanban-fill",
        value: total.toLocaleString("fr-FR"),
        label: "Projets",
        captionHighlight: publicCount.toLocaleString("fr-FR"),
        caption: "publics",
        highlightColor: "success",
        trend: "none",
      }))
      .catch((error) => {
        console.warn("[dashboard] statistiques projets indisponibles", error);
        return unavailableStat("bi bi-kanban-fill", "Projets");
      }),
    getTreasuryBalance()
      .then((balance): StatItem => ({
        icon: "bi bi-cash-stack",
        value: formatSolde(balance),
        label: "Caisse",
        highlightColor: balance >= 0 ? "success" : "danger",
        trend: "none",
      }))
      .catch((error) => {
        console.warn("[dashboard] solde de la caisse indisponible", error);
        return unavailableStat("bi bi-cash-stack", "Caisse");
      }),
  ]);

  return [members, projects, treasury];
}
