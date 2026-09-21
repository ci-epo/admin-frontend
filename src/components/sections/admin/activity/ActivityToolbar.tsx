import InputIcon from "@/components/ui/form/input/InputIcon";

export default function ActivityToolbar() {
  return (
    <div className="d-flex align-items-center justify-content-end gap-2 mb-4 position-relative z-1">
      <button type="button" className="btn btn-danger flex-shrink-0">
        <i className="ri-add-line me-1" aria-hidden="true"></i>Ajouter
      </button>
      <div className="w-100" style={{ maxWidth: 440 }}>
        <InputIcon
          id="activity-search"
          type="search"
          icon="ri-search-2-line text-muted"
          placeholder="Rechercher..."
          aria-label="Rechercher une activité"
        />
      </div>
    </div>
  );
}
