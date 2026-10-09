import { apiClient } from "@/lib/api/client";
import { parseMemberListDto } from "@/lib/schemas/member.schema";
import type { CreateMemberCommand, Member, UpdateMemberCommand } from "@/types/member";

const MEMBERS_LIMIT = 100;

export async function listMembers(): Promise<Member[]> {
  const dto = await apiClient<unknown>({
    path: `/members?page=1&limit=${MEMBERS_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseMemberListDto(dto);
}

export async function createMember(command: CreateMemberCommand): Promise<void> {
  await apiClient<unknown>({ path: "/members", method: "POST", body: command, cache: "no-store" });
}

export async function updateMember(publicId: string, command: UpdateMemberCommand): Promise<void> {
  await apiClient<unknown>({
    path: `/members/${encodeURIComponent(publicId)}`,
    method: "PATCH",
    body: command,
    cache: "no-store",
  });
}

export async function deleteMember(publicId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/members/${encodeURIComponent(publicId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}
