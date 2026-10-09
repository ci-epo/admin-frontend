/** `ScheduleTable` réel (`schema.prisma`) : un créneau n'a ni titre ni libellé, juste date/horaires/lieu. */
export interface Schedule {
  publicId: string;
  /** ISO renvoyé par l'API (minuit UTC = minuit à Ouagadougou, UTC+0 sans heure d'été). */
  date: string;
  beginHour: string;
  endHour: string;
  localisation: string;
}

export interface CreateScheduleCommand {
  date: string;
  beginHour: string;
  endHour: string;
  localisation: string;
}

export type UpdateScheduleCommand = Partial<CreateScheduleCommand>;

/** Événement FullCalendar dérivé d'un créneau réel (pas de titre libre : le lieu en tient lieu). */
export interface ScheduleCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: { beginHour: string; endHour: string; localisation: string };
}

/** Événement brut renvoyé par `getCieCalendarEvents()` (objets `EventApi` de FullCalendar). */
export interface RawCalendarEvent {
  id: string;
  start: Date | null;
  end: Date | null;
  extendedProps: { beginHour?: string; endHour?: string; localisation?: string };
}

/** Événement normalisé pour les listes « à venir » / « passés » de la barre latérale. */
export interface CalendarEvent {
  id: string;
  start: Date;
  end: Date | null;
  beginHour: string;
  endHour: string;
  localisation: string;
}

export interface CalendarEventGroups {
  upcoming: CalendarEvent[];
  past: CalendarEvent[];
}

/** Globals posés sur `window` par le script vanilla du calendrier (préfixe `cie`). */
export type CalendarWindow = Window & {
  initCieAppsCalendar?: (initialEvents?: ScheduleCalendarEvent[]) => void;
  destroyCieAppsCalendar?: () => void;
  getCieCalendarEvents?: () => RawCalendarEvent[];
  setCieCalendarEvents?: (events: ScheduleCalendarEvent[]) => void;
  FullCalendar?: unknown;
};
