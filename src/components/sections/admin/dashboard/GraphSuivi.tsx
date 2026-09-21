/**
 * Carte "Average Order Value" avec onglets Line/Bar.
 * Le contenu des onglets (#average-line, #average-bar) est rempli
 * par le script externe /assets/js/dashboard/e-commerce.init.js (ApexCharts).
 */
export default function GraphSuivi() {
  return (
    <div className="card">
      <div className="card-header">
        <h4>Graphe de suivi du club</h4>
        <div className="d-flex align-items-center">
          <ul className="nav nav-pills me-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="average-line-tab"
                data-bs-toggle="pill"
                data-bs-target="#average-line"
                type="button"
                role="tab"
                aria-controls="average-line"
                aria-selected="true"
              >
                Line
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="average-bar-tab"
                data-bs-toggle="pill"
                data-bs-target="#average-bar"
                type="button"
                role="tab"
                aria-controls="average-bar"
                aria-selected="false"
              >
                Bar
              </button>
            </li>
          </ul>
          <div className="dropdown">
            <a
              href="#"
              data-bs-toggle="dropdown"
              className="text-muted"
              aria-expanded="false"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-start">
              <li>
                <a className="dropdown-item" href="#">
                  Membres
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Activites
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Caisse
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active apexcharts-container"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex={0}
            id="average-line"
          ></div>
          <div
            className="tab-pane fade"
            id="average-bar"
            role="tabpanel"
            aria-labelledby="average-bar-tab"
            tabIndex={0}
          ></div>
        </div>
      </div>
    </div>
  );
}