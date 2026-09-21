import type { AboutTechItem } from "@/components/sections/admin/about/types";

interface AboutTechProps {
  items: AboutTechItem[];
}

export default function AboutTech({ items }: AboutTechProps) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="ri-stack-line me-2 text-primary"></i>Technologies utilisées
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {items.map((t) => (
            <div className="col-md-6 col-xl-4" key={t.name}>
              <div className="about-tech-item d-flex align-items-center gap-3">
                <span className="about-tech-icon" aria-hidden>
                  <i className={t.icon}></i>
                </span>
                <div>
                  <h6 className="mb-0 fs-14">{t.name}</h6>
                  <p className="text-muted small mb-0">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
