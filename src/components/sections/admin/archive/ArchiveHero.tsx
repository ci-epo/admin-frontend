interface ArchiveHeroStat {
  value: string;
  label: string;
}

interface ArchiveHeroProps {
  stats: ArchiveHeroStat[];
}

export default function ArchiveHero({ stats }: ArchiveHeroProps) {
  return (
    <div className="card archive-hero mb-4 position-relative z-1">
      <div className="card-body p-4 p-lg-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div className="d-flex align-items-start gap-3">
            <span className="archive-hero-icon" aria-hidden>
              <i className="ri-archive-2-line"></i>
            </span>
            <div>
              <h4 className="archive-hero-title mb-1">Archives du club</h4>
              <p className="archive-hero-subtitle mb-0">
                Retrouvez les documents officiels, médias et événements passés.
                Filtrez par catégorie, année ou visibilité.
              </p>
            </div>
          </div>

          <div className="archive-hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="archive-hero-stat">
                <div className="archive-hero-stat-value">{stat.value}</div>
                <div className="archive-hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
