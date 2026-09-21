/** Modal — Ajouter / modifier un événement (les ids sont pilotés par le script vanilla). */
export default function CalendarEventFormModal() {
  return (
    <div
      className="modal fade"
      id="exampleModalToggle"
      aria-hidden="true"
      aria-labelledby="exampleModalToggleLabel"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0">
          <div className="modal-header p-3">
            <h5 className="modal-title">Ajouter un événement</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fermer"
            />
          </div>
          <div className="modal-body p-4">
            <form className="needs-validation" name="event-form" id="form-event">
              <input type="hidden" id="calendar-event-id" />
              <label htmlFor="calendar-event-title" className="mb-2">
                Titre :
              </label>
              <input
                type="text"
                placeholder="Titre de l'événement"
                className="form-control moving-placeholder"
                id="calendar-event-title"
                required
              />
              <div className="text-danger mt-2" id="titleErr" />
              <label className="mb-2" htmlFor="form-select-01">
                Libellé :
              </label>
              <select
                className="form-select mb-2"
                id="form-select-01"
                name="form-select-01"
                aria-label="Choisir un libellé"
                defaultValue=""
              >
                <option value="">Ouvrir le menu</option>
                <option value="bg-danger-subtle">Danger</option>
                <option value="bg-warning-subtle">Warning</option>
                <option value="bg-primary-subtle">Primary</option>
                <option value="bg-success-subtle">Success</option>
              </select>
              <div className="col-12 mb-2">
                <label htmlFor="calendar-event-date-start" className="form-label">
                  Du :
                </label>
                <input type="date" className="form-control" id="calendar-event-date-start" />
              </div>
              <div className="col-12 mb-2">
                <label htmlFor="calendar-event-date-end" className="form-label">
                  Au :
                </label>
                <input type="date" className="form-control" id="calendar-event-date-end" />
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="form-control d-block"
                    id="description"
                    placeholder="Description"
                    rows={3}
                    spellCheck={false}
                  />
                </div>
              </div>
              <div className="hstack gap-2 justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
