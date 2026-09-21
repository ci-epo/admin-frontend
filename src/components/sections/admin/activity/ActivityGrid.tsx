import ActivityCard from "@/components/ui/card/ActivityCard";
import type { Activity } from "@/types/activity";

interface ActivityGridProps {
  activities: Activity[];
}

export default function ActivityGrid({ activities }: ActivityGridProps) {
  return (
    <div className="row g-4">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          image={{ src: activity.imageSrc, alt: activity.imageAlt }}
          title={activity.title}
          description={activity.description}
          footer={activity.footer}
        />
      ))}
    </div>
  );
}
