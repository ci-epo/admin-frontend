import { apiClient } from "@/lib/api/client";
import { parseScheduleListDto } from "@/lib/schemas/schedule.schema";
import type { CreateScheduleCommand, Schedule, UpdateScheduleCommand } from "@/types/calendar";

const LIST_LIMIT = 100;

export async function listSchedules(): Promise<Schedule[]> {
  const dto = await apiClient<unknown>({
    path: `/schedules?page=1&limit=${LIST_LIMIT}`,
    method: "GET",
    cache: "no-store",
  });
  return parseScheduleListDto(dto);
}

export async function createSchedule(command: CreateScheduleCommand): Promise<void> {
  await apiClient<unknown>({ path: "/schedules", method: "POST", body: command, cache: "no-store" });
}

export async function updateSchedule(publicId: string, command: UpdateScheduleCommand): Promise<void> {
  await apiClient<unknown>({
    path: `/schedules/${encodeURIComponent(publicId)}`,
    method: "PATCH",
    body: command,
    cache: "no-store",
  });
}

export async function deleteSchedule(publicId: string): Promise<void> {
  await apiClient<unknown>({
    path: `/schedules/${encodeURIComponent(publicId)}`,
    method: "DELETE",
    cache: "no-store",
  });
}
