import StatCard from "@/components/ui/stat_card/StatCard";
import type { StatItem } from "@/types/stat";

interface TreasuryStatsRowProps {
  stats: StatItem[];
}

export default function TreasuryStatsRow({ stats }: TreasuryStatsRowProps) {
  return (
    <div className="row g-4 mb-4 position-relative z-1">
      {stats.map((stat) => (
        <div key={stat.label} className="col-xl-4 col-md-6">
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}
