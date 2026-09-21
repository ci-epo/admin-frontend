import type { ProductCategory } from "@/types/dashboard";

interface ProductStatisticsProps {
  total: string;
  totalLabel: string;
  totalChange: string;
  categories: ProductCategory[];
}

const BADGE_VARIANT: Record<ProductCategory["variant"], string> = {
  primary: "bg-primary-subtle text-primary",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
  success: "bg-success-subtle text-success",
  info: "bg-info-subtle text-info",
};

export default function ProductStatistics({
  total,
  totalLabel,
  totalChange,
  categories,
}: ProductStatisticsProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h4>Product Statistics</h4>
          <p className="mb-0 text-muted">Track your product sales</p>
        </div>
        <a href="#" className="link">
          View All
        </a>
      </div>
      <div className="card-body">
        <div className="position-relative">
          {/* Cible du donut ApexCharts */}
          <div id="product-statistics"></div>
          <div className="product-chart text-center">
            <h3>{total}</h3>
            <p className="mb-0">{totalLabel}</p>
            <span className="badge bg-success py-1 rounded-pill">
              {totalChange}
            </span>
          </div>
        </div>

        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            className={`d-flex justify-content-between ${
              idx < categories.length - 1 ? "mb-2" : ""
            }`}
          >
            <div>
              <i className={`${cat.icon} fs-5 me-3`}></i>
              {cat.name}
            </div>
            <div>
              <span className="text-muted me-3">
                {cat.count.toLocaleString("fr-FR")}
              </span>
              <span
                className={`badge ${BADGE_VARIANT[cat.variant]} px-2 rounded-3`}
              >
                {cat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}