import type { StatItem } from "@/types/stat";

type StatCardProps = StatItem;

export default function StatCard({
  icon,
  value,
  label,
  caption,
  captionHighlight,
  highlightColor = "success",
  trend = "up",
}: StatCardProps) {
  const trendIconClass =
    trend === "up"
      ? "bi bi-graph-up-arrow text-success"
      : trend === "down"
      ? "bi bi-graph-down-arrow text-danger"
      : "";

  return (
    <div className="card card-h-100">
      <div className="card-body d-flex align-items-center justify-content-around">
        <div className="h-48px w-50px position-relative d-flex justify-content-center align-items-center text-primary fs-4 rounded-3 shadow-lg border">
          <i className={icon}></i>
        </div>
        <div>
          <h3>
            {value}{" "}
            {trend !== "none" && (
              <i className={`${trendIconClass} fw-normal fs-5`}></i>
            )}
          </h3>
          <span className="fs-5">{label}</span>
          {(caption || captionHighlight) && (
            <p className="fs-12 mb-0">
              {captionHighlight && (
                <span className={`text-${highlightColor}`}>
                  {captionHighlight}
                </span>
              )}
              {captionHighlight && caption ? " " : ""}
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}