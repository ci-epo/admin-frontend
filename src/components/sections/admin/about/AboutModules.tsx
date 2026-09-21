import Link from "next/link";
import type { AboutModule } from "@/components/sections/admin/about/types";

interface AboutModulesProps {
  modules: AboutModule[];
}

export default function AboutModules({ modules }: AboutModulesProps) {
  return (
    <div id="about-modules" className="mb-2">
      <div className="d-flex flex-wrap align-items-end justify-content-between mb-3 gap-2">
        <div>
          <h4 className="mb-1">Modules de gestion</h4>
          <p className="text-muted mb-0">
            Les espaces qui composent la plateforme d&apos;administration.
          </p>
        </div>
      </div>
      <div className="row g-4 mb-4">
        {modules.map((mod) => (
          <div className="col-md-6 col-xl-4" key={mod.title}>
            <Link
              href={mod.href}
              className="card about-module-card h-100 mb-0 text-decoration-none"
            >
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <span
                    className={`about-pole-icon bg-${mod.color}-subtle text-${mod.color}`}
                    aria-hidden
                  >
                    <i className={mod.icon}></i>
                  </span>
                  {mod.status === "beta" ? (
                    <span className="badge bg-warning-subtle text-warning">Bêta</span>
                  ) : (
                    <span className="badge bg-success-subtle text-success">Stable</span>
                  )}
                </div>
                <h5 className="fs-15 mb-2 text-body">{mod.title}</h5>
                <p className="text-muted small mb-3">{mod.description}</p>
                <span className="about-module-link">
                  Ouvrir le module<i className="ri-arrow-right-line ms-1"></i>
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
