export default function AdministrationHeader() {
  return (
    <div className="card archive-hero mb-4 position-relative z-1">
      <div className="card-body p-4 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div className="d-flex align-items-start gap-3">
          <span className="archive-hero-icon" aria-hidden>
            <i className="ri-settings-3-line"></i>
          </span>
          <div>
            <h1 className="h4 archive-hero-title mb-1">Administration</h1>
            <p className="archive-hero-subtitle mb-0">
              Réglages du site public et de l&apos;espace d&apos;administration, sauvegardes et restaurations de la
              base de données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
