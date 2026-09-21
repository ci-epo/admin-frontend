/** Modal — Détails d'un événement (les ids sont pilotés par le script vanilla). */
export default function CalendarEventDetailsModal() {
  return (
    <div
      className="modal fade"
      id="eventDetailsModal"
      aria-hidden="true"
      aria-labelledby="eventDetailsModalLabel"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0">
          <div className="modal-header p-3">
            <h5 className="modal-title" id="eventDetailsTitle">
              Détails
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fermer"
            />
          </div>
          <div className="modal-body">
            <p id="eventDetailsTitleText" />
            <p id="eventDetailsLabel" />
            <p id="eventDetailsStart" />
            <p id="eventDetailsEnd" />
            <p id="eventDetailsDescription" />
          </div>
          <div className="modal-footer">
            <button type="button" id="editEventBtn" className="btn btn-primary">
              Modifier
            </button>
            <button type="button" id="deleteEventBtn" className="btn btn-danger">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
