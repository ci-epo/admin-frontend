type PaginationSize = "sm" | "md" | "lg";
type PaginationColor =
  | "primary" | "secondary" | "success" | "danger"
  | "warning" | "info" | "light" | "dark";

interface PaginationAppearance {
  size?: PaginationSize;
  rounded?: boolean;
  color?: PaginationColor;
}

interface PaginationProps {
  /** Page courante (1-indexée) — composant contrôlé. */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  appearance?: PaginationAppearance;
  ariaLabel?: string;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  appearance = {},
  ariaLabel = "Pagination",
  className = "",
}: PaginationProps) {
  const { size = "md", rounded = false, color } = appearance;

  const ulClass = [
    "pagination",
    size !== "md" ? `pagination-${size}` : "",
    rounded ? "pagination-rounded" : "",
    color ? `pagination-${color}` : "",
    "mb-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label={ariaLabel}>
      <ul className={ulClass}>
        <li className={`page-item${page === 1 ? " disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            aria-label="Page précédente"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          >
            <i className="ri-arrow-left-s-line fw-semibold" aria-hidden="true" />
          </button>
        </li>

        {pages.map((p) => (
          <li key={p} className={`page-item${p === page ? " active" : ""}`}>
            <button
              type="button"
              className="page-link"
              aria-current={p === page ? "page" : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          </li>
        ))}

        <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            aria-label="Page suivante"
            disabled={page === totalPages}
            onClick={() => onChange(page + 1)}
          >
            <i className="ri-arrow-right-s-line fw-semibold" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
