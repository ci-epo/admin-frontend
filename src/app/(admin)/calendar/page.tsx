import { notFound } from "next/navigation";
import { isModuleDisabled } from "@/lib/api/administration.endpoints";
import { loadSchedules } from "@/lib/api/schedule.loader";
import AppCalendar from "@/components/sections/admin/calendar/AppCalendar";
import {
  createScheduleAction,
  deleteScheduleAction,
  updateScheduleAction,
} from "@/app/(admin)/calendar/calendar.actions";

export const metadata = {
  title: "Calendrier | CIE Admin",
  description: "Calendrier des activités",
};

export default async function CalendarPage() {
  // Module désactivé depuis la page Administration : introuvable, même par son URL.
  if (await isModuleDisabled("calendar")) notFound();

  const schedules = await loadSchedules();

  return (
    <AppCalendar
      schedules={schedules}
      createAction={createScheduleAction}
      updateAction={updateScheduleAction}
      deleteAction={deleteScheduleAction}
    />
  );
}
