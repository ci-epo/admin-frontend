import { useCallback, useEffect, useState } from "react";
import { groupCalendarEvents } from "@/lib/utils/calendar-events";
import {
  forgetScript,
  loadScriptOnce,
  waitForGlobal,
} from "@/lib/utils/vanilla-script";
import type { CalendarEventGroups, CalendarWindow } from "@/types/calendar";

const FULLCALENDAR_SRC = "/assets/libs/fullcalendar/index.global.min.js";
const SWEETALERT_SRC = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js";
const CALENDAR_INIT_SRC = "/assets/js/app/apps-calendar.init.js";
const EVENTS_CHANGED = "cieCalendarEventsChanged";

const EMPTY_GROUPS: CalendarEventGroups = { upcoming: [], past: [] };

/**
 * Pont React ↔ script vanilla du calendrier : charge FullCalendar, appelle
 * `initCieAppsCalendar` au montage et `destroyCieAppsCalendar` au démontage,
 * puis relaie les événements via `cieCalendarEventsChanged`.
 */
export function useCieCalendar(): CalendarEventGroups {
  const [groups, setGroups] = useState<CalendarEventGroups>(EMPTY_GROUPS);

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
        loadScriptOnce(SWEETALERT_SRC).catch(() => undefined);
        // Recharge systématiquement l'init pour capter getCieCalendarEvents
        forgetScript(CALENDAR_INIT_SRC);
        await loadScriptOnce(CALENDAR_INIT_SRC);
        if (cancelled) return;
        (window as CalendarWindow).initCieAppsCalendar?.();
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

  return groups;
}
