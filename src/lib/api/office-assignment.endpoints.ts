import { apiClient } from "@/lib/api/client";
import {
  parseMandateOptionListDto,
  parseMemberOptionListDto,
  parseOfficeAssignmentListDto,
  parsePositionOptionListDto,
  type RawOfficeAssignment,
} from "@/lib/schemas/office-assignment.schema";
import type {
  CreateOfficeAssignmentCommand,
  MemberOption,
  SelectOption,
  UpdateOfficeAssignmentCommand,
} from "@/types/office-assignment";

const OPTIONS_LIMIT = 100;
const ASSIGNMENTS_LIMIT = 20;

export async function listMemberOptions(): Promise<MemberOption[]> {
  const dto = await apiClient<unknown>({
    path: `/members?page=1&limit=${OPTIONS_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseMemberOptionListDto(dto);
}

export async function listPositionOptions(): Promise<SelectOption[]> {
  const dto = await apiClient<unknown>({
    path: `/positions?page=1&limit=${OPTIONS_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parsePositionOptionListDto(dto);
}

export async function listMandateOptions(): Promise<SelectOption[]> {
  const dto = await apiClient<unknown>({
    path: `/mandates?page=1&limit=${OPTIONS_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseMandateOptionListDto(dto);
}

/** Les plus récentes affectations en premier (`ORDER BY created_at DESC` côté `app-service`). */
export async function listOfficeAssignments(): Promise<RawOfficeAssignment[]> {
  const dto = await apiClient<unknown>({
    path: `/office-assignments?page=1&limit=${ASSIGNMENTS_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseOfficeAssignmentListDto(dto);
}

export async function createOfficeAssignment(command: CreateOfficeAssignmentCommand): Promise<void> {
  await apiClient<unknown>({ path: "/office-assignments", method: "POST", body: command, cache: "no-store" });
}

export async function updateOfficeAssignment(publicId: string, command: UpdateOfficeAssignmentCommand): Promise<void> {
  await apiClient<unknown>({
    path: `/office-assignments/${encodeURIComponent(publicId)}`,
    method: "PATCH",
    body: command,
    cache: "no-store",
  });
}

export async function deleteOfficeAssignment(publicId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/office-assignments/${encodeURIComponent(publicId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}
