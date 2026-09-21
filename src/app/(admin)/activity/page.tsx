import ActivityGrid from "@/components/sections/admin/activity/ActivityGrid";
import ActivityToolbar from "@/components/sections/admin/activity/ActivityToolbar";
import { ACTIVITIES } from "@/components/sections/admin/activity/mockData";

export const metadata = {
  title: "Activités | CIE Admin",
  description: "Liste des activités du club",
};

export default function ActivitiesPage() {
  return (
    <>
      <ActivityToolbar />
      <ActivityGrid activities={ACTIVITIES} />
    </>
  );
}
