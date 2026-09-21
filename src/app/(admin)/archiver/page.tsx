import ArchiveCatalogue from "@/components/sections/admin/archive/ArchiveCatalogue";
import ArchiveHero from "@/components/sections/admin/archive/ArchiveHero";
import {
  ARCHIVE_CATEGORIES_BY_TYPE,
  ARCHIVE_HERO_STATS,
  ARCHIVE_ITEMS,
  ARCHIVE_TYPE_TABS,
} from "@/components/sections/admin/archive/mockData";

export const metadata = {
  title: "Archives | CIE Admin",
  description: "Consultation et gestion des archives du club",
};

export default function ArchivesPage() {
  return (
    <>
      <ArchiveHero stats={ARCHIVE_HERO_STATS} />
      <ArchiveCatalogue
        items={ARCHIVE_ITEMS}
        typeTabs={ARCHIVE_TYPE_TABS}
        categoriesByType={ARCHIVE_CATEGORIES_BY_TYPE}
      />
    </>
  );
}
