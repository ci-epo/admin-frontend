import type { AboutSupportLink } from "@/components/sections/admin/about/types";

interface AboutSupportProps {
  links: AboutSupportLink[];
}

export default function AboutSupport({ links }: AboutSupportProps) {
  return (
    <div id="about-support" className="row g-4 mb-4">
      {links.map((s) => (
        <div className="col-md-4" key={s.title}>
          <div className="card about-support-card h-100 mb-0">
            <div className="card-body text-center">
              <span className="about-value-icon" aria-hidden>
                <i className={s.icon}></i>
              </span>
              <h6 className="mt-3 mb-2">{s.title}</h6>
              <p className="text-muted small mb-3">{s.description}</p>
              <button type="button" className="btn btn-light btn-sm">
                {s.action}
                <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
