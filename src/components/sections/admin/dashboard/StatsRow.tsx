import Image from "next/image";
import StatCard from "@/components/ui/stat_card/StatCard";
import type { StatItem } from "@/types/stat";

interface StatsRowProps {
  stats: StatItem[];
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="row">
      <div className="col-xxl-8">
        <div className="row h-100">
          {stats.map((stat) => (
            <div key={stat.label} className="col-xl-4 col-sm-6">
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>

      <div className="col-xxl-4">
        <div className="card overflow-hidden bg-primary card-h-100 p-4">
          <div className="row">
            <div className="col-8">
              <div className="vector-image">
                <Image
                  className="img-fluid welcome-img w-200px mb-n20 mt-n5"
                  src="/assets/images/dashboard/upgrade-img.png"
                  width={200}
                  height={200}
                  alt="CRM Vector"
                />
              </div>
            </div>
            <div className="col-4">
              <div className="text-end">
                <p className="mb-5 fs-16 fw-semibold text-white"></p>
                <button
                  type="button"
                  className="btn text-white border border-white mt-1"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
