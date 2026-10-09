import type {
  CalendarEvent,
  CalendarEventGroups,
  RawCalendarEvent,
  Schedule,
  ScheduleCalendarEvent,
} from "@/types/calendar";

/** Sépare les événements FullCalendar en « à venir » (croissants) et « passés » (décroissants). */
export function groupCalendarEvents(raw: readonly RawCalendarEvent[], now: Date = new Date()): CalendarEventGroups {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const upcoming: CalendarEvent[] = [];
  const past: CalendarEvent[] = [];

  for (const event of raw) {
    if (!event.start) continue;
    const start = new Date(event.start);
    const item: CalendarEvent = {
      id: event.id,
      start,
      end: event.end ? new Date(event.end) : null,
      beginHour: event.extendedProps?.beginHour ?? "",
      endHour: event.extendedProps?.endHour ?? "",
      localisation: event.extendedProps?.localisation ?? "",
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

/** `date` (minuit UTC) + `"HH:mm"` → ISO. Le club est à UTC+0 sans heure d'été (cf. `format-date.ts`). */
function combineDateAndHour(date: string, hour: string): string {
  const [hours, minutes] = hour.split(":").map(Number);
  const combined = new Date(date);
  combined.setUTCHours(hours, minutes, 0, 0);
  return combined.toISOString();
}

/** Convertit les créneaux réels en événements FullCalendar (id = `publicId`, titre = lieu). */
export function toScheduleCalendarEvents(schedules: readonly Schedule[]): ScheduleCalendarEvent[] {
  return schedules.map((schedule) => ({
    id: schedule.publicId,
    title: schedule.localisation,
    start: combineDateAndHour(schedule.date, schedule.beginHour),
    end: combineDateAndHour(schedule.date, schedule.endHour),
    extendedProps: {
      beginHour: schedule.beginHour,
      endHour: schedule.endHour,
      localisation: schedule.localisation,
    },
  }));
}
