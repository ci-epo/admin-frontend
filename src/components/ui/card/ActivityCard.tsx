import StatusBadge from "@/components/ui/badge/StatusBadge";
import type { ActivityType } from "@/types/activity";

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  CONTEST: "Compétition",
  TRAINING: "Formation",
  PROJECT: "Projet",
};

const ACTIVITY_TYPE_TONE: Record<ActivityType, "primary" | "info" | "warning"> = {
  CONTEST: "primary",
  TRAINING: "info",
  PROJECT: "warning",
};

interface CardAction {
  label: string;
  icon?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface ActivityCardProps {
  title: string;
  type: ActivityType;
  description: string;
  scheduleLabel: string;
  trainerName: string;
  mandateLabel: string;
  /** Menu « ⋮ » de la carte ; vide, la carte n'affiche pas de menu. */
  actions?: CardAction[];
  colClass?: string;
}

export default function ActivityCard({
  title,
  type,
  description,
  scheduleLabel,
  trainerName,
  mandateLabel,
  actions = [],
  colClass = "col-md-6 col-xl-4",
}: ActivityCardProps) {
  return (
    <div className={colClass}>
      <div className="card h-100">
        <div className="card-header d-flex justify-content-between align-items-start gap-2">
          <div>
            <h5 className="card-title mb-1">{title}</h5>
            <StatusBadge label={ACTIVITY_TYPE_LABEL[type]} tone={ACTIVITY_TYPE_TONE[type]} />
          </div>
          {actions.length > 0 && (
            <div className="dropdown flex-shrink-0">
              <button
                className="btn btn-light btn-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label={`Actions pour ${title}`}
              >
                <i className="ri-more-2-fill" aria-hidden="true"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {actions.map((action) => (
                  <li key={action.label}>
                    <button
                      type="button"
                      className={`dropdown-item${action.danger ? " text-danger" : ""}`}
                      onClick={action.onClick}
                    >
                      {action.icon && <i className={`${action.icon} me-2`} aria-hidden="true"></i>}
                      {action.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card-body">
          <p className="card-text">{description || "Aucune description."}</p>
        </div>

        <div className="card-footer text-muted fs-13">
          <div>
            <i className="ri-calendar-line me-1" aria-hidden="true"></i>
            {scheduleLabel}
          </div>
          <div>
            <i className="ri-user-line me-1" aria-hidden="true"></i>
            {trainerName}
          </div>
          <div>
            <i className="ri-archive-line me-1" aria-hidden="true"></i>
            Mandat {mandateLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
