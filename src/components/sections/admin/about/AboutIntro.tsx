import type { AboutApp } from "@/components/sections/admin/about/types";

interface AboutIntroProps {
  app: AboutApp;
}

const HIGHLIGHTS = [
  "Interface unifiée pour toute la gestion du club",
  "Droits d'accès adaptés à chaque rôle",
  "Données centralisées, exportables et archivables",
];

export default function AboutIntro({ app }: AboutIntroProps) {
  const details = [
    { label: "Application", value: app.name },
    { label: "Version", value: app.version, className: "font-monospace" },
    { label: "Dernière MAJ", value: app.releaseDate },
  ];

  return (
    <div className="card mb-4">
      <div className="card-body p-4">
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <h4 className="mb-2">À propos de la plateforme</h4>
            <p className="text-muted mb-3">
              {app.name} centralise la gestion administrative du club au
              sein d&apos;une interface unique&nbsp;: suivi des membres,
              planification des activités, gestion de la trésorerie et
              conservation des archives. Chaque module est pensé pour simplifier
              le travail du bureau et garder une trace claire de la vie du club.
            </p>
            <ul className="list-unstyled about-checklist mb-0">
              {HIGHLIGHTS.map((text) => (
                <li key={text}>
                  <i className="ri-checkbox-circle-fill text-primary me-2"></i>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4">
            <div className="about-info-panel">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="d-flex justify-content-between py-2 border-bottom"
                >
                  <span className="text-muted">{detail.label}</span>
                  <span className={`fw-medium ${detail.className ?? ""}`.trim()}>
                    {detail.value}
                  </span>
                </div>
              ))}
              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">Statut</span>
                <span className="badge bg-success-subtle text-success">
                  <i className="ri-checkbox-blank-circle-fill me-1 fs-11"></i>Opérationnel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
