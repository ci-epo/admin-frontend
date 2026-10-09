import Alert from "@/components/ui/alert/Alert";

interface AdminAnnouncementProps {
  message: string;
}

/** Bandeau affiché en tête de toutes les pages de l'administration (réglé dans Administration › Espace admin). */
export default function AdminAnnouncement({ message }: AdminAnnouncementProps) {
  return (
    <div className="position-relative z-1 pt-3">
      <Alert variant="warning" icon="ri-megaphone-line" message={message} className="mb-0" />
    </div>
  );
}
