import type {
  CalendarEvent,
  CalendarEventGroups,
  RawCalendarEvent,
} from "@/types/calendar";

/** Sépare les événements FullCalendar en « à venir » (croissants) et « passés » (décroissants). */
export function groupCalendarEvents(
  raw: readonly RawCalendarEvent[],
  now: Date = new Date(),
): CalendarEventGroups {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const upcoming: CalendarEvent[] = [];
  const past: CalendarEvent[] = [];

  for (const event of raw) {
    if (!event.start) continue;
    const start = new Date(event.start);
    const item: CalendarEvent = {
      id: event.id,
      title: event.title,
      start,
      end: event.end ? new Date(event.end) : null,
      label: event.extendedProps?.label ?? "",
    };
    (start >= today ? upcoming : past).push(item);
  }

  upcoming.sort((a, b) => a.start.getTime() - b.start.getTime());
  past.sort((a, b) => b.start.getTime() - a.start.getTime());

  return { upcoming, past };
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
