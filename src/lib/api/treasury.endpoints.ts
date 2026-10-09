import { apiClient } from "@/lib/api/client";
import {
  parseAccountListDto,
  parseCategoryListDto,
  parseCreatedOperatorDto,
  parseCreatedTransactionDto,
  parseOperatorListDto,
  parseTransactionListDto,
  type AccountDto,
  type CategoryDto,
  type OperatorDto,
  type TransactionDto,
} from "@/lib/schemas/treasury.schema";
import type { CreateOperatorCommand, CreateTransactionCommand } from "@/types/treasury";

const LIST_LIMIT = 100;

export async function listAccounts(): Promise<AccountDto[]> {
  const dto = await apiClient<unknown>({
    path: `/accounts?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseAccountListDto(dto);
}

export async function listCategories(): Promise<CategoryDto[]> {
  const dto = await apiClient<unknown>({
    path: `/categories?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseCategoryListDto(dto);
}

export async function listOperators(): Promise<OperatorDto[]> {
  const dto = await apiClient<unknown>({
    path: `/operators?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseOperatorListDto(dto);
}

export async function listTransactions(): Promise<TransactionDto[]> {
  const dto = await apiClient<unknown>({
    path: `/transactions?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseTransactionListDto(dto);
}

/** Contrairement à `createMember`, le `publicId` créé est nécessaire tout de suite pour la transaction liée. */
export async function createOperator(command: CreateOperatorCommand): Promise<OperatorDto> {
  const dto = await apiClient<unknown>({ path: "/operators", method: "POST", body: command, cache: "no-store" });
  return parseCreatedOperatorDto(dto);
}

export async function createTransaction(command: CreateTransactionCommand): Promise<TransactionDto> {
  const dto = await apiClient<unknown>({ path: "/transactions", method: "POST", body: command, cache: "no-store" });
  return parseCreatedTransactionDto(dto);
}

export async function deleteTransaction(publicId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/transactions/${encodeURIComponent(publicId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}
