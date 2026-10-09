"use client";

import { useState } from "react";
import DeleteActivityDialog from "@/components/sections/admin/activity/DeleteActivityDialog";
import EditActivityModal from "@/components/sections/admin/activity/EditActivityModal";
import ActivityCard from "@/components/ui/card/ActivityCard";
import type { FormAction } from "@/types/administration";
import type { ActivityFormOptions, ActivityRow } from "@/types/activity";

interface ActivityCardWithActionsProps {
  activity: ActivityRow;
  options: ActivityFormOptions;
  updateAction: FormAction;
  deleteAction: FormAction;
}

type OpenDialog = "edit" | "delete" | null;

export default function ActivityCardWithActions({
  activity,
  options,
  updateAction,
  deleteAction,
}: ActivityCardWithActionsProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <ActivityCard
        title={activity.name}
        type={activity.type}
        description={activity.description ?? ""}
        scheduleLabel={activity.scheduleLabel}
        trainerName={activity.trainerName}
        mandateLabel={activity.mandateLabel}
        actions={[
          { label: "Modifier", icon: "ri-pencil-line", onClick: () => setDialog("edit") },
          { label: "Supprimer", icon: "ri-delete-bin-line", onClick: () => setDialog("delete"), danger: true },
        ]}
      />
      {/* Montés à l'ouverture seulement : chaque ouverture repart d'un formulaire vierge. */}
      {dialog === "edit" && (
        <EditActivityModal activity={activity} options={options} action={updateAction} isOpen onClose={close} />
      )}
      {dialog === "delete" && (
        <DeleteActivityDialog activity={activity} action={deleteAction} isOpen onClose={close} />
      )}
    </>
  );
}
