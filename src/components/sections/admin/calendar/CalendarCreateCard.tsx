interface CalendarCreateCardProps {
  onAdd: () => void;
}

/** Ouvre le formulaire d'ajout d'un créneau (la date se pré-remplit aussi via un clic direct sur le calendrier). */
export default function CalendarCreateCard({ onAdd }: CalendarCreateCardProps) {
  return (
    <div className="card">
      <div className="p-5">
        <button type="button" className="btn btn-primary w-100" onClick={onAdd}>
          <i className="ri-add-line me-1" aria-hidden="true"></i>
          Créer un créneau
        </button>
      </div>
    </div>
  );
}
