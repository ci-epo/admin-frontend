import ArchiveCardGrid from "@/components/sections/admin/archive/ArchiveCardGrid";
import ArchiveCardList from "@/components/sections/admin/archive/ArchiveCardList";
import type { ArchiveItem, ArchiveViewMode } from "@/types/archive";

interface ArchiveCardProps {
  item: ArchiveItem;
  view?: ArchiveViewMode;
  /** Index utilisé pour l'animation décalée au chargement */
  index?: number;
}

export default function ArchiveCard({ item, view = "grid", index = 0 }: ArchiveCardProps) {
  const style = { animationDelay: `${Math.min(index, 8) * 60}ms` };

  return view === "list" ? (
    <ArchiveCardList item={item} style={style} />
  ) : (
    <ArchiveCardGrid item={item} style={style} />
  );
}
