export default function SearchModal() {
  return (
    <div
      className="modal fade search-modal"
      id="searchModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="searchModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header d-block">
            <div className="form-icon">
              <input
                type="text"
                className="form-control form-control-icon"
                id="searchInputInModal"
                placeholder="Search"
              />
              <div className="search-btn w-44px">
                <i className="ri-search-line text-muted fs-16"></i>
              </div>
              <button
                type="button"
                className="btn-close position-absolute end-0 top-50 translate-middle-y d-inline-block m-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          </div>
          <div className="modal-body" data-simplebar id="list-items">
            <ul className="list-unstyled mb-0" id="searchList"></ul>
          </div>
        </div>
      </div>
    </div>
  );
}