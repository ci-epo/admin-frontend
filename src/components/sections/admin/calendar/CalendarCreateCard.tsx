import { EXTERNAL_EVENTS } from "@/components/sections/admin/calendar/event-labels";

/** Bouton « Créer un événement » + modèles glissables (le script vanilla lit les data-*). */
export default function CalendarCreateCard() {
  return (
    <div className="card">
      <div className="p-5 pb-0">
        <div>
          <button
            type="button"
            className="btn btn-primary w-100"
            data-bs-target="#exampleModalToggle"
            data-bs-toggle="modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="d-inline-block align-middle me-1"
              aria-hidden
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Créer un événement
          </button>
          <div id="external-events-container">
            {EXTERNAL_EVENTS.map((event) => (
              <div
                key={event.title}
                className={`external-event bg-${event.tone}-subtle border-2 border-start border-${event.tone} text-${event.tone} py-2 my-1`}
                data-class={`bg-${event.tone}-subtle`}
                data-title={event.title}
                data-description={event.description}
              >
                <i className="mdi mdi-checkbox-blank-circle me-2" /> {event.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
