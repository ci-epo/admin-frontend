import { Fragment } from "react";
import Image from "next/image";
import type { CountryGrowth, CountryBubble } from "@/types/dashboard";

interface CustomerGrowthProps {
  bubbles: CountryBubble[];
  countries: CountryGrowth[];
}

export default function CustomerGrowth({
  bubbles,
  countries,
}: CustomerGrowthProps) {
  // On affiche les pays par paires (2 par ligne, comme dans le thème original)
  const rows: CountryGrowth[][] = [];
  for (let i = 0; i < countries.length; i += 2) {
    rows.push(countries.slice(i, i + 2));
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h4>Customer Growth</h4>
          <p className="mb-0 text-muted">Track Customer per location</p>
        </div>
        <a href="#" className="link">
          View All
        </a>
      </div>
      <div className="card-body">
        <div className="bubble-container">
          {bubbles.map((b, idx) => (
            <div key={idx} className={`bubble bubble${b.index}`}>
              {b.value}
            </div>
          ))}
        </div>

        {rows.map((pair, rowIdx) => (
          <div
            key={rowIdx}
            className="d-flex align-items-center gap-4 mb-5"
          >
            {pair.map((country) => (
              <Fragment key={country.name}>
                <Image
                  src={country.flagUrl}
                  height={30}
                  width={30}
                  className="object-fit-cover rounded-circle"
                  alt={`${country.name} flag`}
                />
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center fs-13">
                    <p className="text-muted mb-1">{country.name}</p>
                  </div>
                  <div className="progress progress-sm">
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${country.percent}%` }}
                    ></div>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}