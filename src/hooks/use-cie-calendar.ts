import { useCallback, useEffect, useRef, useState } from "react";
import { groupCalendarEvents } from "@/lib/utils/calendar-events";
import {
  forgetScript,
  loadScriptOnce,
  waitForGlobal,
} from "@/lib/utils/vanilla-script";
import type { CalendarEventGroups, CalendarWindow, ScheduleCalendarEvent } from "@/types/calendar";

const FULLCALENDAR_SRC = "/assets/libs/fullcalendar/index.global.min.js";
const CALENDAR_INIT_SRC = "/assets/js/app/apps-calendar.init.js";
const EVENTS_CHANGED = "cieCalendarEventsChanged";

const EMPTY_GROUPS: CalendarEventGroups = { upcoming: [], past: [] };

/**
 * Pont React ↔ script vanilla du calendrier : charge FullCalendar, appelle
 * `initCieAppsCalendar` au montage et `destroyCieAppsCalendar` au démontage, garde la source
 * d'événements synchronisée avec `events` (après une Server Action + `revalidatePath`), puis
 * relaie les événements affichés via `cieCalendarEventsChanged`.
 */
export function useCieCalendar(events: ScheduleCalendarEvent[]): CalendarEventGroups {
  const [groups, setGroups] = useState<CalendarEventGroups>(EMPTY_GROUPS);
  // Capture la valeur la plus récente pour l'amorçage asynchrone, sans re-déclencher l'effet de montage.
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  const syncEvents = useCallback(() => {
    const raw = (window as CalendarWindow).getCieCalendarEvents?.() ?? [];
    setGroups(groupCalendarEvents(raw));
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        await loadScriptOnce(FULLCALENDAR_SRC);
        if (cancelled) return;
        await waitForGlobal("FullCalendar");
        if (cancelled) return;
        // Recharge systématiquement l'init pour capter les nouveaux globals exposés.
        forgetScript(CALENDAR_INIT_SRC);
        await loadScriptOnce(CALENDAR_INIT_SRC);
        if (cancelled) return;
        (window as CalendarWindow).initCieAppsCalendar?.(eventsRef.current);
        syncEvents();
      } catch (error) {
        console.error("[useCieCalendar] init failed", error);
      }
    })();

    window.addEventListener(EVENTS_CHANGED, syncEvents);

    return () => {
      cancelled = true;
      (window as CalendarWindow).destroyCieAppsCalendar?.();
      window.removeEventListener(EVENTS_CHANGED, syncEvents);
    };
  }, [syncEvents]);

  useEffect(() => {
    (window as CalendarWindow).setCieCalendarEvents?.(events);
    syncEvents();
  }, [events, syncEvents]);

  return groups;
}
