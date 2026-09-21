export type StatHighlightColor = "success" | "danger" | "primary" | "warning";

export type StatTrend = "up" | "down" | "none";

/** Indicateur chiffré affiché par `StatCard` (dashboard, trésorerie…). */
export interface StatItem {
  icon: string;
  value: string;
  label: string;
  /** Texte en sourdine sous le label (ex: "Sales Increment Rate") */
  caption?: string;
  /** Préfixe coloré dans le caption (ex: "+8%") */
  captionHighlight?: string;
  /** Couleur du préfixe — défaut: success */
  highlightColor?: StatHighlightColor;
  /** Tendance affichée à côté de la valeur — défaut: "up" */
  trend?: StatTrend;
}
