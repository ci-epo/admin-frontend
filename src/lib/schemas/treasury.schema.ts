import { asObject, invalidResponse, readNumber, readString } from "@/lib/schemas/guards";
import type { CreateOperatorCommand, CreateTransactionCommand, Road } from "@/types/treasury";

export interface AccountDto {
  publicId: string;
  name: string;
  balance: number;
}

export type CategoryType = "entree" | "sortie";

export interface CategoryDto {
  publicId: string;
  name: string;
  type: CategoryType;
}

export interface OperatorDto {
  publicId: string;
  name: string;
  phoneNumber: string;
  whatsapp: string;
}

export interface TransactionDto {
  publicId: string;
  accountId: string;
  categoryId: string;
  operatorId: string;
  description: string;
  road: Road;
  date: Date;
  amount: number;
}

function parsePage(value: unknown, what: string): unknown[] {
  const source = asObject(value, what);
  const data = source.data;
  if (!Array.isArray(data)) throw invalidResponse(`${what}.data`, data);
  return data;
}

function parseCategoryType(value: unknown, what: string): CategoryType {
  if (value !== "entree" && value !== "sortie") throw invalidResponse(`${what}.type`, value);
  return value;
}

function parseRoad(value: unknown, what: string): Road {
  if (value !== "orange_money" && value !== "moov_money" && value !== "banquaire") {
    throw invalidResponse(`${what}.road`, value);
  }
  return value;
}

function parseAccountDto(value: unknown, what: string): AccountDto {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    name: readString(source, "name", what),
    balance: readNumber(source, "balance", what),
  };
}

function parseCategoryDto(value: unknown, what: string): CategoryDto {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    name: readString(source, "name", what),
    type: parseCategoryType(source.type, what),
  };
}

function parseOperatorDto(value: unknown, what: string): OperatorDto {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    name: readString(source, "name", what),
    phoneNumber: readString(source, "phoneNumber", what),
    whatsapp: readString(source, "whatsapp", what),
  };
}

function parseTransactionDto(value: unknown, what: string): TransactionDto {
  const source = asObject(value, what);
  return {
    publicId: readString(source, "publicId", what),
    accountId: readString(source, "accountId", what),
    categoryId: readString(source, "categoryId", what),
    operatorId: readString(source, "operatorId", what),
    description: readString(source, "description", what),
    road: parseRoad(source.road, what),
    date: new Date(readString(source, "date", what)),
    amount: readNumber(source, "amount", what),
  };
}

export function parseAccountListDto(value: unknown): AccountDto[] {
  return parsePage(value, "accounts").map((item) => parseAccountDto(item, "accounts.data[]"));
}

export function parseCategoryListDto(value: unknown): CategoryDto[] {
  return parsePage(value, "categories").map((item) => parseCategoryDto(item, "categories.data[]"));
}

export function parseOperatorListDto(value: unknown): OperatorDto[] {
  return parsePage(value, "operators").map((item) => parseOperatorDto(item, "operators.data[]"));
}

export function parseTransactionListDto(value: unknown): TransactionDto[] {
  return parsePage(value, "transactions").map((item) => parseTransactionDto(item, "transactions.data[]"));
}

export function parseCreatedOperatorDto(value: unknown): OperatorDto {
  return parseOperatorDto(value, "operators");
}

export function parseCreatedTransactionDto(value: unknown): TransactionDto {
  return parseTransactionDto(value, "transactions");
}

export type FormResult<T> = { ok: true; data: T } | { ok: false; fieldErrors: Record<string, string> };

function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

/** Validation minimale (champs requis) : le format fin (téléphone E.164, etc.) est vérifié par app-service. */
export function parseOperatorForm(form: FormData): FormResult<CreateOperatorCommand> {
  const name = text(form, "operatorName");
  const phoneNumber = text(form, "operatorPhone");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.operatorName = "Nom requis.";
  if (!phoneNumber) fieldErrors.operatorPhone = "Téléphone requis.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { name, phoneNumber, whatsapp: phoneNumber } };
}

export function parseCreateTransactionForm(form: FormData, operatorId: string): FormResult<CreateTransactionCommand> {
  const accountId = text(form, "accountId");
  const categoryId = text(form, "categoryId");
  const road = text(form, "road") as Road;
  const date = text(form, "date");
  const objectif = text(form, "objectif");
  const amount = Number(text(form, "amount"));

  const fieldErrors: Record<string, string> = {};
  if (!accountId) fieldErrors.accountId = "Caisse requise.";
  if (!categoryId) fieldErrors.categoryId = "Catégorie requise.";
  if (!road) fieldErrors.road = "Moyen de paiement requis.";
  if (!date) fieldErrors.date = "Date requise.";
  if (!objectif) fieldErrors.objectif = "Objectif requis.";
  if (!Number.isFinite(amount) || amount <= 0) fieldErrors.amount = "Montant invalide.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data: { accountId, categoryId, operatorId, description: objectif, road, date, amount } };
}
