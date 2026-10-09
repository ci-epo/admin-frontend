import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import { loadActivityBoard } from "@/lib/api/activity.loader";
import ActivityBoard from "@/components/sections/admin/activity/ActivityBoard";
import {
  createActivityAction,
  deleteActivityAction,
  updateActivityAction,
} from "@/app/(admin)/activity/activity.actions";

export const metadata = {
  title: "Activités | CIE Admin",
  description: "Liste des activités du club",
};

export default async function ActivitiesPage() {
  // Module désactivé depuis la page Administration : introuvable, même par son URL.
  if (await isModuleDisabled("activity")) notFound();

  const board = await loadActivityBoard();

  return (
    <ActivityBoard
      rows={board.rows}
      options={board.options}
      createAction={createActivityAction}
      updateAction={updateActivityAction}
      deleteAction={deleteActivityAction}
    />
  );
}
