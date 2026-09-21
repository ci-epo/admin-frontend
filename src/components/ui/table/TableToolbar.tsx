import { useId } from "react";
import InputIcon from "@/components/ui/form/input/InputIcon";

interface ToolbarFilter {
  label: string;
  options: readonly string[];
}

interface TableToolbarProps {
  title: string;
  addLabel?: string;
  searchPlaceholder?: string;
  filters?: readonly ToolbarFilter[];
  size?: "sm" | "md";
}

/** En-tête de carte d'un tableau de gestion : titre, bouton d'ajout, recherche et filtres. */
export default function TableToolbar({
  title,
  addLabel = "Ajouter",
  searchPlaceholder = "Rechercher...",
  filters = [],
  size = "sm",
}: TableToolbarProps) {
  const searchId = useId();
  const sizeClass = size === "sm" ? " btn-sm" : "";

  return (
    <div className="card-header flex-wrap gap-3">
      <h4 className="mb-0">{title}</h4>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <button type="button" className={`btn btn-primary${sizeClass}`}>
          <i className="ri-add-line me-1" aria-hidden="true"></i>
          {addLabel}
        </button>
        <InputIcon
          id={searchId}
          type="search"
          icon="ri-search-2-line text-muted"
          size={size}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
        {filters.map((filter) => (
          <div key={filter.label} className="btn-group">
            <button
              className={`btn btn-outline-primary dropdown-toggle${sizeClass}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {filter.label}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {filter.options.map((option) => (
                <li key={option}>
                  <button type="button" className="dropdown-item">
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
