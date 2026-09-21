type ProgressColor =
  | "primary" | "secondary" | "success" | "danger"
  | "warning" | "info" | "light" | "dark";

type ProgressStripe = "static" | "animated";

interface ProgressBarProps {
  value: number;              // 0-100
  range?: { min?: number; max?: number };
  color?: ProgressColor;
  stripe?: ProgressStripe;    // absent = pas de rayures
  /** `true` affiche "{value}%", une chaîne surcharge le texte. */
  label?: string | boolean;
  ariaLabel?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  range = {},
  color,
  stripe,
  label = false,
  ariaLabel,
  className = "",
}: ProgressBarProps) {
  const { min = 0, max = 100 } = range;
  const percent = Math.min(Math.max(value, min), max);

  const barClass = [
    "progress-bar",
    stripe ? "progress-bar-striped" : "",
    stripe === "animated" ? "progress-bar-animated" : "",
    color ? `bg-${color}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`progress ${className}`.trim()}
      role="progressbar"
      aria-label={ariaLabel ?? `${color ?? "default"} progress`}
      aria-valuenow={percent}
      aria-valuemin={min}
      aria-valuemax={max}
    >
      <div className={barClass} style={{ width: `${percent}%` }}>
        {label && (typeof label === "string" ? label : `${percent}%`)}
      </div>
    </div>
  );
}