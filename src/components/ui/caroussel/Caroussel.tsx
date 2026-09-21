"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

interface CarouselSlide {
  src: string;
  alt?: string;
  captionTitle?: string;
  captionText?: string;
}

type IndicatorStyle = "default" | "bullet";
type IndicatorColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

interface CarouselIndicators {
  style?: IndicatorStyle;
  color?: IndicatorColor;
}

interface CarouselProps {
  slides: CarouselSlide[];
  defaultActiveIndex?: number;
  /** Présent = indicateurs affichés. */
  indicators?: CarouselIndicators;
  controls?: boolean;
  fade?: boolean;
  interval?: number | false;
  className?: string;
}

export default function Caroussel({
  slides,
  defaultActiveIndex = 0,
  indicators,
  controls = false,
  fade = false,
  interval = 4000,
  className = "",
}: CarouselProps) {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const { style: indicatorStyle = "default", color: indicatorColor } = indicators ?? {};

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length]
  );

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (!interval) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [interval, next]);

  const indicatorClass = [
    "carousel-indicators",
    indicatorStyle === "bullet" ? "carousel-indicators-bullet" : "",
    indicatorColor ? `carousel-indicators-${indicatorColor}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={id}
      className={["carousel slide", fade ? "carousel-fade" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Indicators */}
      {indicators && (
        <div className={indicatorClass}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === activeIndex ? "active" : ""}
              aria-current={i === activeIndex ? "true" : undefined}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Slides */}
      <div className="carousel-inner">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`carousel-item${i === activeIndex ? " active" : ""}`}
          >
            <Image
              src={slide.src}
              width={800}
              height={450}
              className="d-block w-100"
              alt={slide.alt ?? `Slide ${i + 1}`}
            />
            {(slide.captionTitle || slide.captionText) && (
              <div className="carousel-caption d-none d-md-block">
                {slide.captionTitle && (
                  <h5 className="text-white">{slide.captionTitle}</h5>
                )}
                {slide.captionText && <p>{slide.captionText}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      {controls && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            onClick={prev}
            aria-label="Previous"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={next}
            aria-label="Next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  );
}