/**
 * Types métier utilisés par le dashboard e-commerce.
 * Quand l'API sera branchée, ces types correspondront aux réponses backend.
 */

export type OrderStatus = "Actif" | "Inactif";

export interface Order {
  id: string;
  email: string;
  product: string;
  status: OrderStatus;
  tracking: string;
  avatarUrl: string;
  checked?: boolean;
}

export interface ProductCategory {
  /** Nom de la catégorie */
  name: string;
  /** Classe d'icône (ex: "ri-ram-line", "bi bi-controller") */
  icon: string;
  /** Nombre de ventes */
  count: number;
  /** Variation (ex: "+5.34%") */
  change: string;
  /** Couleur du badge */
  variant: "primary" | "warning" | "danger" | "success" | "info";
}

export interface CountryGrowth {
  name: string;
  flagUrl: string;
  /** Pourcentage de remplissage de la barre (0-100) */
  percent: number;
}

export interface CountryBubble {
  /** Valeur affichée dans la bulle (ex: "2,489") */
  value: string;
  /** Numéro de classe CSS bubble (1 à 4) */
  index: 1 | 2 | 3 | 4;
}
