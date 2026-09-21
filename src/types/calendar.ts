/** Événement brut exposé par le script vanilla `apps-calendar.init.js` (FullCalendar). */
export interface RawCalendarEvent {
  id: string;
  title: string;
  start: Date | null;
  end: Date | null;
  classNames: string[];
  extendedProps: { label?: string; description?: string };
}

/** Événement normalisé pour l'affichage des listes « à venir » / « passés ». */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date | null;
  label: string;
}

export interface CalendarEventGroups {
  upcoming: CalendarEvent[];
  past: CalendarEvent[];
}

/** Globals posés sur `window` par le script vanilla du calendrier (préfixe `cie`). */
export type CalendarWindow = Window & {
  initCieAppsCalendar?: () => void;
  destroyCieAppsCalendar?: () => void;
  getCieCalendarEvents?: () => RawCalendarEvent[];
  FullCalendar?: unknown;
};
