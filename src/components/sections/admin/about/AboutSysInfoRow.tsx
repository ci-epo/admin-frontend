import type { AboutSysInfo } from "@/components/sections/admin/about/types";

interface AboutSysInfoRowProps {
  items: AboutSysInfo[];
}

export default function AboutSysInfoRow({ items }: AboutSysInfoRowProps) {
  return (
    <div className="row g-3 mb-4">
      {items.map((info) => (
        <div className="col-6 col-xl-3" key={info.label}>
          <div className="card about-stat-card h-100 mb-0">
            <div className="card-body d-flex align-items-center gap-3">
              <span className="about-stat-icon" aria-hidden>
                <i className={info.icon}></i>
              </span>
              <div>
                <h4 className="mb-0 fw-semibold">{info.value}</h4>
                <p className="text-muted mb-0 small">{info.label}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
