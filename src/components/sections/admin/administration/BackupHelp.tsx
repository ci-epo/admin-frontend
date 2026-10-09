/** Ce que contient une sauvegarde et les bons réflexes : affiché à côté de la liste. */
export default function BackupHelp() {
  return (
    <div className="card mb-0">
      <div className="card-body">
        <h2 className="h6">
          <i className="ri-information-line me-1 text-info" aria-hidden="true"></i>À savoir
        </h2>
        <ul className="text-muted small ps-3 mb-0 d-flex flex-column gap-1">
          <li>Une sauvegarde contient toute la base : membres, activités, trésorerie, comptes, réglages des deux sites.</li>
          <li>Elle contient aussi des données sensibles (mots de passe chiffrés, sessions) : stockez les copies avec soin.</li>
          <li>Les fichiers restent sur le serveur, à côté de la base : téléchargez régulièrement une copie ailleurs.</li>
          <li>Une restauration remplace toute la base ; l&apos;état d&apos;avant est d&apos;abord sauvegardé (« Avant restauration »).</li>
        </ul>
      </div>
    </div>
  );
}
