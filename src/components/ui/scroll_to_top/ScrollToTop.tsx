/**
 * Bouton flottant "retour en haut" avec progression circulaire.
 * L'animation et le scroll sont gérés par /assets/js/scroll-top.init.js
 * qui cherche #progress-scroll dans le DOM.
 */
export default function ScrollToTop() {
  return (
    <div
      className="progress-wrap d-flex align-items-center justify-content-center cursor-pointer h-40px w-40px position-fixed"
      id="progress-scroll"
    >
      <svg
        className="progress-circle w-100 h-100 position-absolute"
        viewBox="0 0 100 100"
      >
        <circle cx={50} cy={50} r={45} className="progress" />
      </svg>
      <i className="ri-arrow-up-line fs-16 z-1 position-relative text-primary"></i>
    </div>
  );
}