import type { ReactNode } from "react";

interface EmptyStateProps {
  /** Classe d'icône (ex: "ri-inbox-archive-line"). */
  icon: string;
  title: string;
  description?: string;
  /** Action proposée à l'utilisateur (bouton de réinitialisation, de création…). */
  action?: ReactNode;
  className?: string;
}

/** État « vide » d'une liste ou d'une page (voir docs : chargement / erreur / vide / succès). */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`card ${className}`.trim()}>
      <div className="card-body text-center py-5">
        {/* archive-empty-icon : pastille ronde du thème (urbix-next-bridge.css) */}
        <span className="archive-empty-icon" aria-hidden>
          <i className={icon}></i>
        </span>
        <h6 className="mb-1">{title}</h6>
        {description && <p className="text-muted mb-3">{description}</p>}
        {action}
      </div>
    </div>
  );
}
