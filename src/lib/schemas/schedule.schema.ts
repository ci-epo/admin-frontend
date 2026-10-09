import { asObject, invalidResponse, readString } from "@/lib/schemas/guards";
import { formatDate } from "@/lib/utils/format-date";
import type { SelectOption } from "@/types/office-assignment";
import type { CreateScheduleCommand, Schedule, UpdateScheduleCommand } from "@/types/calendar";

function parsePage(value: unknown, what: string): unknown[] {
  const source = asObject(value, what);
  const data = source.data;
  if (!Array.isArray(data)) throw invalidResponse(`${what}.data`, data);
  return data;
}

function parseScheduleDto(value: unknown, what: string): Schedule {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    date: readString(source, "date", what),
    beginHour: readString(source, "beginHour", what),
    endHour: readString(source, "endHour", what),
    localisation: readString(source, "localisation", what),
  };
}

export function parseScheduleListDto(value: unknown): Schedule[] {
  return parsePage(value, "schedules").map((item) => parseScheduleDto(item, "schedules.data[]"));
}

/** Libellé d'un créneau pour les menus déroulants (formulaire « Activités ») : date, horaires, lieu. */
export function toScheduleOption(schedule: Schedule): SelectOption {
  const date = formatDate(new Date(schedule.date));
  return {
    publicId: schedule.publicId,
    label: `${date} · ${schedule.beginHour}–${schedule.endHour} · ${schedule.localisation}`,
  };
}

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

export function parseCreateScheduleForm(form: FormData): FormResult<CreateScheduleCommand> {
  const date = text(form, "date");
  const beginHour = text(form, "beginHour");
  const endHour = text(form, "endHour");
  const localisation = text(form, "localisation");

  const fieldErrors: Record<string, string> = {};
  if (!date) fieldErrors.date = "Date requise.";
  if (!beginHour) fieldErrors.beginHour = "Heure de début requise.";
  if (!endHour) fieldErrors.endHour = "Heure de fin requise.";
  if (beginHour && endHour && beginHour >= endHour) {
    fieldErrors.endHour = "L'heure de fin doit être après l'heure de début.";
  }
  if (!localisation) fieldErrors.localisation = "Lieu requis.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { date, beginHour, endHour, localisation } };
}

export function parseUpdateScheduleForm(form: FormData): FormResult<UpdateScheduleCommand> {
  return parseCreateScheduleForm(form);
}
