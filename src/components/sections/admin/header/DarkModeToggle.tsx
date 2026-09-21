/**
 * Toggle clair / sombre. La logique d'ajout/retrait de la classe
 * data-bs-theme sur <html> est gérée par /assets/js/layout-setup.js
 * qui écoute les clics sur #lightModeBtn et #darkModeBtn.
 */
export default function DarkModeToggle() {
  return (
    <div className="dark-mode-btn" id="toggleMode">
      <button
        className="btn header-btn active"
        id="lightModeBtn"
        type="button"
        aria-label="Switch to light mode"
      >
        <i className="bi bi-brightness-high"></i>
      </button>
      <button
        className="btn header-btn"
        id="darkModeBtn"
        type="button"
        aria-label="Switch to dark mode"
      >
        <i className="bi bi-moon-stars"></i>
      </button>
    </div>
  );
}