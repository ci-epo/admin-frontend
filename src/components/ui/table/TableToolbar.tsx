import { useId, type ChangeEvent } from "react";
import InputIcon from "@/components/ui/form/input/InputIcon";

interface ToolbarFilter {
  label: string;
  options: readonly string[];
  /** Option sélectionnée ; sans `onChange`, le menu reste décoratif (comportement historique). */
  value?: string;
  onChange?: (option: string) => void;
}

interface TableToolbarProps {
  title: string;
  addLabel?: string;
  /** Sans handler, le bouton reste un simple bouton décoratif (comportement historique). */
  onAdd?: () => void;
  searchPlaceholder?: string;
  /** Recherche contrôlée ; sans `onSearchChange`, le champ reste libre et sans effet (comportement historique). */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: readonly ToolbarFilter[];
  size?: "sm" | "md";
}

/** En-tête de carte d'un tableau de gestion : titre, bouton d'ajout, recherche et filtres. */
export default function TableToolbar({
  title,
  addLabel = "Ajouter",
  onAdd,
  searchPlaceholder = "Rechercher...",
  searchValue,
  onSearchChange,
  filters = [],
  size = "sm",
}: TableToolbarProps) {
  const searchId = useId();
  const sizeClass = size === "sm" ? " btn-sm" : "";

  return (
    <div className="card-header flex-wrap gap-3">
      <h4 className="mb-0">{title}</h4>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <button type="button" className={`btn btn-primary${sizeClass}`} onClick={onAdd}>
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
          {...(onSearchChange && {
            value: searchValue ?? "",
            onChange: (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value),
          })}
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
                  <button
                    type="button"
                    className={`dropdown-item${option === filter.value ? " active" : ""}`}
                    onClick={() => filter.onChange?.(option)}
                  >
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
