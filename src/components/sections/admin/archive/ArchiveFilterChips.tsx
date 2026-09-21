"use client";

interface ArchiveFilterChipsProps {
  title: string;
  options: readonly string[];
  selected: readonly string[];
  onToggle: (option: string) => void;
}

export default function ArchiveFilterChips({
  title,
  options,
  selected,
  onToggle,
}: ArchiveFilterChipsProps) {
  return (
    <>
      <h4 className="text-muted text-uppercase fs-12 fw-medium mb-3">{title}</h4>
      <div className="d-flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`archive-chip${isSelected ? " active" : ""}`}
              aria-pressed={isSelected}
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </>
  );
}
