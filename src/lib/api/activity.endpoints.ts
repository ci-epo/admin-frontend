import { apiClient } from "@/lib/api/client";
import { parseActivityListDto } from "@/lib/schemas/activity.schema";
import type { Activity, CreateActivityCommand, UpdateActivityCommand } from "@/types/activity";

const LIST_LIMIT = 100;

export async function listActivities(): Promise<Activity[]> {
  const dto = await apiClient<unknown>({
    path: `/activities?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseActivityListDto(dto);
}

export async function createActivity(command: CreateActivityCommand): Promise<void> {
  await apiClient<unknown>({ path: "/activities", method: "POST", body: command, cache: "no-store" });
}

export async function updateActivity(publicId: string, command: UpdateActivityCommand): Promise<void> {
  await apiClient<unknown>({
    path: `/activities/${encodeURIComponent(publicId)}`,
    method: "PATCH",
    body: command,
    cache: "no-store",
  });
}

export async function deleteActivity(publicId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/activities/${encodeURIComponent(publicId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}
