import Image from "next/image";
import type { NotificationItem } from "@/components/sections/admin/header/types";

interface NotificationRowProps {
  item: NotificationItem;
}

export default function NotificationRow({ item }: NotificationRowProps) {
  return (
    <div className="noti-item">
      {item.avatarUrl ? (
        <Image src={item.avatarUrl} width={36} height={36} alt="Avatar" className="avatar-md" />
      ) : (
        <div
          className={`avatar-md d-flex align-items-center justify-content-center fs-16 ${
            item.iconBg ?? "bg-primary-subtle text-primary"
          }`}
        >
          <i className={item.icon}></i>
        </div>
      )}

      <div className="flex-grow-1">
        <a href="#" className="text-decoration-none stretched-link">
          <h6 className="mb-1 fw-semibold">
            {item.actor && <strong className="fw-semibold text-body">{item.actor}</strong>}
            {item.actorIcon && <i className={item.actorIcon} aria-hidden="true"></i>}
            {item.title &&
              (item.actor ? (
                <span className="fw-normal text-muted fs-13"> {item.title}</span>
              ) : (
                item.title
              ))}
          </h6>
        </a>
        <p className="text-muted mb-2 fs-12">{item.date}</p>

        {item.detail && (
          <div className="p-2 bg-body-tertiary bg-opacity-50 rounded">
            <p className="mb-0 lh-base fs-13">{item.detail}</p>
          </div>
        )}

        {item.attachment && (
          <div className="d-flex align-items-center gap-2 p-2 position-relative z-1 border rounded">
            <div className="avatar-md d-flex align-items-center rounded justify-content-center flex-shrink-0 bg-danger-subtle text-danger">
              <i className={item.attachment.icon}></i>
            </div>
            <div className="flex-grow-1">
              <a href="#">
                <h6 className="mb-2">{item.attachment.name}</h6>
              </a>
              <p className="mb-0 text-muted fs-12">{item.attachment.size}</p>
            </div>
          </div>
        )}
      </div>

      <a
        href="#"
        className="position-absolute top-0 end-0 mt-2 me-3 fs-18 link link-danger z-1"
        aria-label="Dismiss notification"
      >
        <i className="bi bi-x"></i>
      </a>
    </div>
  );
}
