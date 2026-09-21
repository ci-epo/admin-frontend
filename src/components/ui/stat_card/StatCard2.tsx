"use client";

import React, { useEffect, useRef, useState } from "react";

type StatCardVariant = "card" | "inline";

interface StatCardFormat {
  prefix?: string;
  suffix?: string;
  separator?: boolean;
}

interface StatCardIcon {
  name: string;          // classe icône ex: "ri-money-dollar-circle-line"
  bgClass?: string;      // classe bg du cercle icône
  textClass?: string;    // classe texte de l'icône
}

interface StatCardProps {
  label: string;
  value: number;
  format?: StatCardFormat;
  duration?: number;       // secondes pour l'animation
  icon?: StatCardIcon;
  variant?: StatCardVariant;
  /** Classes du conteneur (colonnes de grille comprises). */
  className?: string;
}

function formatNumber(value: number, separator: boolean, prefix = "", suffix = ""): string {
  const formatted = separator
    ? Math.round(value).toLocaleString("en-US")
    : Math.round(value).toString();
  return `${prefix}${formatted}${suffix}`;
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    const steps = 60;
    const stepDuration = (duration * 1000) / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(Math.round((target / steps) * step), target));
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return current;
}

export default function StatCard({
  label,
  value,
  format = {},
  duration = 5,
  icon,
  variant = "card",
  className = "col-12 col-md-6 col-xl-3",
}: StatCardProps) {
  const { prefix = "", suffix = "", separator = true } = format;
  const {
    bgClass: iconBgClass = "bg-light-subtle",
    textClass: iconClass = "fs-24 fw-medium text-light-emphasis",
  } = icon ?? {};
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // Démarre l'animation au moment où le composant entre dans le viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const current = useCountUp(value, duration, started);
  const display = formatNumber(current, separator, prefix, suffix);

  if (variant === "inline") {
    return (
      <div ref={ref} className={`text-center p-4 ${className}`.trim()}>
        <h3 className="fw-bold mb-0">{display}</h3>
        <p className="mb-0 fs-6">{label}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <div className="card card-body p-5 rounded-3 mb-0">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="mb-1 fs-6">{label}</p>
            <div className="d-flex align-items-center gap-1 mt-2">
              <h3 className="fw-bold mb-0">{display}</h3>
            </div>
          </div>
          {icon && (
            <div className={`h-48px w-48px ${iconBgClass} rounded-circle d-flex align-items-center justify-content-center`}>
              <i className={`${icon.name} ${iconClass}`} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}