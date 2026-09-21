interface RowAction {
  label: string;
  /** Classe d'icône (ex: "ri-eye-line"). */
  icon?: string;
}

interface RowActionsProps {
  actions: readonly RowAction[];
  ariaLabel?: string;
}

/** Menu « ⋮ » d'actions d'une ligne de tableau (menu Bootstrap, piloté par data-bs-toggle). */
export default function RowActions({ actions, ariaLabel = "Actions" }: RowActionsProps) {
  return (
    <div className="dropdown">
      <button
        className="btn btn-light btn-sm"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label={ariaLabel}
      >
        <i className="ri-more-2-fill" aria-hidden="true"></i>
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        {actions.map((action) => (
          <li key={action.label}>
            <button type="button" className="dropdown-item">
              {action.icon && <i className={`${action.icon} me-2`} aria-hidden="true"></i>}
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
