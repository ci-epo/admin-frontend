import type { ChangeEvent } from "react";
import InputIcon from "@/components/ui/form/input/InputIcon";

interface ActivityToolbarProps {
  onAdd: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function ActivityToolbar({ onAdd, searchValue, onSearchChange }: ActivityToolbarProps) {
  return (
    <div className="d-flex align-items-center justify-content-end gap-2 mb-4 position-relative z-1">
      <button type="button" className="btn btn-danger flex-shrink-0" onClick={onAdd}>
        <i className="ri-add-line me-1" aria-hidden="true"></i>Ajouter
      </button>
      <div className="w-100" style={{ maxWidth: 440 }}>
        <InputIcon
          id="activity-search"
          type="search"
          icon="ri-search-2-line text-muted"
          placeholder="Rechercher..."
          aria-label="Rechercher une activité"
          value={searchValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
        />
      </div>
    </div>
  );
}
