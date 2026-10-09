import { asObject, invalidResponse, readString } from "@/lib/schemas/guards";
import type {
  CreateOfficeAssignmentCommand,
  MemberOption,
  SelectOption,
  UpdateOfficeAssignmentCommand,
} from "@/types/office-assignment";

export interface RawOfficeAssignment {
  publicId: string;
  memberId: string;
  positionId: string;
  mandateId: string;
  beginDate: string;
  endDate: string;
}

function parsePage(value: unknown, what: string): unknown[] {
  const source = asObject(value, what);
  const data = source.data;
  if (!Array.isArray(data)) throw invalidResponse(`${what}.data`, data);
  return data;
}

export function parseMemberOptionListDto(value: unknown): MemberOption[] {
  return parsePage(value, "members").map((item) => {
    const source = asObject(item, "members.data[]");
    const name = readString(source, "name", "members.data[]");
    const firstName = readString(source, "firstName", "members.data[]");
    return {
      publicId: readString(source, "publicId", "members.data[]"),
      label: `${firstName} ${name}`,
      phoneNumber: readString(source, "phoneNumber", "members.data[]"),
    };
  });
}

export function parsePositionOptionListDto(value: unknown): SelectOption[] {
  return parsePage(value, "positions").map((item) => {
    const source = asObject(item, "positions.data[]");
    return {
      publicId: readString(source, "publicId", "positions.data[]"),
      label: readString(source, "name", "positions.data[]"),
    };
  });
}

export function parseMandateOptionListDto(value: unknown): SelectOption[] {
  return parsePage(value, "mandates").map((item) => {
    const source = asObject(item, "mandates.data[]");
    return {
      publicId: readString(source, "publicId", "mandates.data[]"),
      label: readString(source, "label", "mandates.data[]"),
    };
  });
}

function parseOfficeAssignmentDto(value: unknown, what: string): RawOfficeAssignment {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    memberId: readString(source, "memberId", what),
    positionId: readString(source, "positionId", what),
    mandateId: readString(source, "mandateId", what),
    beginDate: readString(source, "beginDate", what),
    endDate: readString(source, "endDate", what),
  };
}

export function parseOfficeAssignmentListDto(value: unknown): RawOfficeAssignment[] {
  return parsePage(value, "officeAssignments").map((item) =>
    parseOfficeAssignmentDto(item, "officeAssignments.data[]"),
  );
}

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

/** Les ids viennent de `<select>` remplis par nos propres options : un champ vide veut dire "non choisi". */
export function parseCreateOfficeAssignmentForm(form: FormData): FormResult<CreateOfficeAssignmentCommand> {
  const memberId = text(form, "memberId");
  const positionId = text(form, "positionId");
  const mandateId = text(form, "mandateId");
  const beginDate = text(form, "beginDate");
  const endDate = text(form, "endDate");

  const fieldErrors: Record<string, string> = {};
  if (!memberId) fieldErrors.memberId = "Choisissez un membre.";
  if (!positionId) fieldErrors.positionId = "Choisissez un poste.";
  if (!mandateId) fieldErrors.mandateId = "Choisissez un mandat.";
  if (!beginDate) fieldErrors.beginDate = "Date de début requise.";
  if (!endDate) fieldErrors.endDate = "Date de fin requise.";
  if (beginDate && endDate && endDate < beginDate) {
    fieldErrors.endDate = "La date de fin doit être après la date de début.";
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { memberId, positionId, mandateId, beginDate, endDate } };
}

/** Modification : le membre reste celui de l'affectation, seuls poste, mandat et dates changent. */
export function parseUpdateOfficeAssignmentForm(form: FormData): FormResult<UpdateOfficeAssignmentCommand> {
  const positionId = text(form, "positionId");
  const mandateId = text(form, "mandateId");
  const beginDate = text(form, "beginDate");
  const endDate = text(form, "endDate");

  const fieldErrors: Record<string, string> = {};
  if (!positionId) fieldErrors.positionId = "Choisissez un poste.";
  if (!mandateId) fieldErrors.mandateId = "Choisissez un mandat.";
  if (!beginDate) fieldErrors.beginDate = "Date de début requise.";
  if (!endDate) fieldErrors.endDate = "Date de fin requise.";
  if (beginDate && endDate && endDate < beginDate) {
    fieldErrors.endDate = "La date de fin doit être après la date de début.";
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { positionId, mandateId, beginDate, endDate } };
}
