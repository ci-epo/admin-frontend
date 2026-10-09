import { listSchedules } from "@/lib/api/schedule.endpoints";
import type { Schedule } from "@/types/calendar";

export async function loadSchedules(): Promise<Schedule[]> {
  try {
    return await listSchedules();
  } catch (error) {
    console.warn("[calendar] créneaux indisponibles", error);
    return [];
  }
}
