import { groupCalendarEvents, toScheduleCalendarEvents } from "@/lib/utils/calendar-events";
import type { RawCalendarEvent, Schedule } from "@/types/calendar";

const buildEvent = (id: string, start: Date | null, localisation = "Salle A"): RawCalendarEvent => ({
  id,
  start,
  end: null,
  extendedProps: { beginHour: "14:00", endHour: "16:00", localisation },
});

describe("groupCalendarEvents", () => {
  const now = new Date(2026, 4, 10, 15, 30);

  it("range les événements d'aujourd'hui et futurs dans « à venir », triés par date croissante", () => {
    const { upcoming } = groupCalendarEvents(
      [
        buildEvent("b", new Date(2026, 4, 20)),
        buildEvent("a", new Date(2026, 4, 10, 8, 0)),
      ],
      now,
    );

    expect(upcoming.map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("range les événements antérieurs à aujourd'hui dans « passés », du plus récent au plus ancien", () => {
    const { past } = groupCalendarEvents(
      [
        buildEvent("old", new Date(2026, 3, 1)),
        buildEvent("recent", new Date(2026, 4, 9)),
      ],
      now,
    );

    expect(past.map((e) => e.id)).toEqual(["recent", "old"]);
  });

  it("ignore un événement sans date de début", () => {
    const groups = groupCalendarEvents([buildEvent("x", null)], now);

    expect(groups).toEqual({ upcoming: [], past: [] });
  });

  it("retourne des champs vides quand l'événement n'a pas d'extendedProps", () => {
    const raw = { ...buildEvent("y", new Date(2026, 4, 12)), extendedProps: {} };

    expect(groupCalendarEvents([raw], now).upcoming[0]).toMatchObject({
      beginHour: "",
      endHour: "",
      localisation: "",
    });
  });
});

describe("toScheduleCalendarEvents", () => {
  it("combine la date (minuit UTC) et les horaires en ISO, avec le lieu comme titre", () => {
    const schedule: Schedule = {
      publicId: "abc",
      date: "2026-10-15T00:00:00.000Z",
      beginHour: "14:00",
      endHour: "16:00",
      localisation: "Salle A",
    };

    const [event] = toScheduleCalendarEvents([schedule]);

    expect(event).toEqual({
      id: "abc",
      title: "Salle A",
      start: "2026-10-15T14:00:00.000Z",
      end: "2026-10-15T16:00:00.000Z",
      extendedProps: { beginHour: "14:00", endHour: "16:00", localisation: "Salle A" },
    });
  });
});
