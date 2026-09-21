"use client";

import CalendarCreateCard from "@/components/sections/admin/calendar/CalendarCreateCard";
import CalendarEventDetailsModal from "@/components/sections/admin/calendar/CalendarEventDetailsModal";
import CalendarEventFormModal from "@/components/sections/admin/calendar/CalendarEventFormModal";
import CalendarEventList from "@/components/sections/admin/calendar/CalendarEventList";
import { useCieCalendar } from "@/hooks/use-cie-calendar";

/**
 * Wrapper React du calendrier vanilla (FullCalendar) : le hook charge les scripts,
 * appelle init/destroy et relaie `cieCalendarEventsChanged`.
 */
export default function AppCalendar() {
  const { upcoming, past } = useCieCalendar();

  return (
    <>
      <div className="row position-relative z-1">
        <div className="col-xl-9">
          <div className="card">
            <div className="card-body">
              <div id="calendar" style={{ minHeight: 600 }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3">
          <CalendarCreateCard />
          <CalendarEventList
            title="Événements à venir"
            events={upcoming}
            emptyLabel="Aucun événement à venir"
          />
          <CalendarEventList
            title="Événements passés"
            events={past}
            emptyLabel="Aucun événement passé"
          />
        </div>
      </div>

      <CalendarEventFormModal />
      <CalendarEventDetailsModal />
    </>
  );
}
