/**
 * Fond décoratif (formes, motifs) affiché derrière les pages d'authentification.
 * Les visuels eux-mêmes sont en CSS dans le thème (classes bg-pattern,
 * auth-pattern-*).
 */
export default function AuthBackground() {
  return (
    <>
      <div className="position-fixed top-0 bottom-0 end-0 start-0 z-0 bg-pattern"></div>
      <div className="auth-pattern-shapes d-none d-lg-block"></div>
      <div className="auth-pattern-outline d-none d-lg-block"></div>
      <div className="auth-pattern-shape extra d-none d-lg-block"></div>
      <div className="auth-pattern-extra d-none d-lg-block"></div>
    </>
  );
}