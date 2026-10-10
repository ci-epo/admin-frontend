import { asObject, invalidResponse, readString } from "@/lib/schemas/guards";
import type { CreateMemberCommand, Member, MemberBaseType, UpdateMemberCommand } from "@/types/member";

function parsePage(value: unknown, what: string): unknown[] {
  const source = asObject(value, what);
  const data = source.data;
  if (!Array.isArray(data)) throw invalidResponse(`${what}.data`, data);
  return data;
}

function parseMemberType(value: unknown, what: string): MemberBaseType {
  if (value !== "MEMBER" && value !== "PARTNER") throw invalidResponse(`${what}.type`, value);
  return value;
}

function parseMemberDto(value: unknown, what: string): Member {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    name: readString(source, "name", what),
    firstName: readString(source, "firstName", what),
    phoneNumber: readString(source, "phoneNumber", what),
    email: readString(source, "email", what),
    type: parseMemberType(source.type, what),
    createdAt: new Date(readString(source, "createdAt", what)),
  };
}

export function parseMemberListDto(value: unknown): Member[] {
  return parsePage(value, "members").map((item) => parseMemberDto(item, "members.data[]"));
}

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

/** Même règle que app-service (`Utils.passwordRegex`) : 8 caractères minimum, une lettre, un chiffre, un symbole. */
export const MEMBER_PASSWORD_RULE = "8 caractères minimum, avec une lettre, un chiffre et un symbole.";
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/** Champs communs de la fiche membre. Le format (téléphone, e-mail) est vérifié par app-service. */
function parseMemberFields(form: FormData): FormResult<Omit<CreateMemberCommand, "password">> {
  const name = text(form, "name");
  const firstName = text(form, "firstName");
  const phoneNumber = text(form, "phoneNumber");
  const email = text(form, "email");
  const rawType = text(form, "type");
  const type: MemberBaseType = rawType === "PARTNER" ? "PARTNER" : "MEMBER";

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Nom requis.";
  if (!firstName) fieldErrors.firstName = "Prénom requis.";
  if (!phoneNumber) fieldErrors.phoneNumber = "Téléphone requis.";
  if (!email) fieldErrors.email = "E-mail requis.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { name, firstName, phoneNumber, email, type } };
}

/**
 * Création : le mot de passe est facultatif. Renseigné, app-service crée aussi le compte de connexion (fiche et compte
 * ensemble). Il n'est jamais coupé ni normalisé : c'est exactement ce que l'utilisateur a saisi.
 */
export function parseCreateMemberForm(form: FormData): FormResult<CreateMemberCommand> {
  const base = parseMemberFields(form);
  const password = String(form.get("password") ?? "");
  if (!base.ok) return base;

  if (password && !PASSWORD_PATTERN.test(password)) {
    return { ok: false, fieldErrors: { password: `Mot de passe : ${MEMBER_PASSWORD_RULE}` } };
  }
  return { ok: true, data: password ? { ...base.data, password } : base.data };
}

/** Modification : pas de mot de passe ici (app-service ne le reçoit qu'à la création). */
export function parseUpdateMemberForm(form: FormData): FormResult<UpdateMemberCommand> {
  return parseMemberFields(form);
}
