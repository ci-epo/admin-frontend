import ActivityCardWithActions from "@/components/sections/admin/activity/ActivityCardWithActions";
import type { FormAction } from "@/types/administration";
import type { ActivityFormOptions, ActivityRow } from "@/types/activity";

interface ActivityGridProps {
  activities: ActivityRow[];
  options: ActivityFormOptions;
  updateAction: FormAction;
  deleteAction: FormAction;
}

export default function ActivityGrid({ activities, options, updateAction, deleteAction }: ActivityGridProps) {
  return (
    <div className="row g-4">
      {activities.map((activity) => (
        <ActivityCardWithActions
          key={activity.publicId}
          activity={activity}
          options={options}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      ))}
    </div>
  );
}
