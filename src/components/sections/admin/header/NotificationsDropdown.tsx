import NotificationRow from "@/components/sections/admin/header/NotificationRow";
import type { NotificationItem } from "@/components/sections/admin/header/types";

interface NotificationsDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
}

export default function NotificationsDropdown({
  notifications,
  unreadCount,
}: NotificationsDropdownProps) {
  return (
    <div className="dropdown pe-dropdown-mega d-none d-md-block">
      <button
        className="btn header-btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Notifications"
      >
        <i className="bi bi-bell"></i>
        <div className="icon-dot"></div>
      </button>
      <div className="dropdown-menu dropdown-mega-md header-dropdown-menu pe-noti-dropdown-menu p-0">
        <div className="p-3 border-bottom">
          <h6 className="d-flex align-items-center mb-0">
            Notification{" "}
            <span className="badge bg-success-subtle text-success ms-auto">
              {unreadCount} Unread
            </span>
          </h6>
        </div>
        <div>
          {notifications.map((n) => (
            <NotificationRow key={n.id} item={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
