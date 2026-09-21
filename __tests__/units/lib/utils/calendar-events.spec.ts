import { groupCalendarEvents } from "@/lib/utils/calendar-events";
import type { RawCalendarEvent } from "@/types/calendar";

const buildEvent = (id: string, start: Date | null, label = "Formation"): RawCalendarEvent => ({
  id,
  title: `Événement ${id}`,
  start,
  end: null,
  classNames: [],
  extendedProps: { label },
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

  it("retourne un libellé vide quand l'événement n'en a pas", () => {
    const raw = { ...buildEvent("y", new Date(2026, 4, 12)), extendedProps: {} };

    expect(groupCalendarEvents([raw], now).upcoming[0].label).toBe("");
  });
});
