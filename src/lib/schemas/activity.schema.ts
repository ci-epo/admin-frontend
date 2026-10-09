import { asObject, invalidResponse, readOptionalString, readString } from "@/lib/schemas/guards";
import type { Activity, ActivityType, CreateActivityCommand, UpdateActivityCommand } from "@/types/activity";

function parsePage(value: unknown, what: string): unknown[] {
  const source = asObject(value, what);
  const data = source.data;
  if (!Array.isArray(data)) throw invalidResponse(`${what}.data`, data);
  return data;
}

function parseActivityType(value: unknown, what: string): ActivityType {
  if (value !== "CONTEST" && value !== "TRAINING" && value !== "PROJECT") {
    throw invalidResponse(`${what}.type`, value);
  }
  return value;
}

function parseActivityDto(value: unknown, what: string): Activity {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    mandateId: readString(source, "mandateId", what),
    trainerId: readString(source, "trainerId", what),
    scheduleId: readString(source, "scheduleId", what),
    name: readString(source, "name", what),
    type: parseActivityType(source.type, what),
    description: readOptionalString(source, "description", what),
  };
}

export function parseActivityListDto(value: unknown): Activity[] {
  return parsePage(value, "activities").map((item) => parseActivityDto(item, "activities.data[]"));
}

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

export function parseCreateActivityForm(form: FormData): FormResult<CreateActivityCommand> {
  const name = text(form, "name");
  const rawType = text(form, "type");
  const type = rawType === "TRAINING" || rawType === "PROJECT" ? rawType : "CONTEST";
  const mandateId = text(form, "mandateId");
  const trainerId = text(form, "trainerId");
  const scheduleId = text(form, "scheduleId");
  const description = text(form, "description");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Nom requis.";
  if (!mandateId) fieldErrors.mandateId = "Choisissez un mandat.";
  if (!trainerId) fieldErrors.trainerId = "Choisissez un formateur.";
  if (!scheduleId) fieldErrors.scheduleId = "Choisissez un créneau.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return {
    ok: true,
    data: { name, type, mandateId, trainerId, scheduleId, description: description || undefined },
  };
}

export function parseUpdateActivityForm(form: FormData): FormResult<UpdateActivityCommand> {
  return parseCreateActivityForm(form);
}
