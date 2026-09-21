import { DEFAULT_LABEL_STYLE, LABEL_STYLES } from "@/components/sections/admin/calendar/event-labels";
import { formatEventDate } from "@/lib/utils/calendar-events";
import type { CalendarEvent } from "@/types/calendar";

interface CalendarEventListProps {
  title: string;
  events: CalendarEvent[];
  emptyLabel: string;
}

export default function CalendarEventList({ title, events, emptyLabel }: CalendarEventListProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h4>{title}</h4>
      </div>
      <div className="card-body p-0" data-simplebar style={{ height: 280 }}>
        <ul className="list-unstyled mb-0 px-3 pt-2">
          {events.length === 0 ? (
            <li className="text-center text-muted py-3 fs-12">{emptyLabel}</li>
          ) : (
            events.map((event, i) => {
              const style = LABEL_STYLES[event.label] ?? DEFAULT_LABEL_STYLE;
              return (
                <li key={event.id}>
                  {i > 0 && <hr className="my-2" />}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{event.title}</h6>
                      <span className="fs-12">{formatEventDate(event.start)}</span>
                    </div>
                    <div>
                      <span className={`badge ${style.bg} rounded-4 ${style.text}`}>
                        <i className={style.icon} /> {event.label}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
