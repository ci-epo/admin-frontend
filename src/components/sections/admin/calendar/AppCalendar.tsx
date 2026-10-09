"use client";

import { useEffect, useMemo, useState } from "react";
import AddScheduleModal from "@/components/sections/admin/calendar/AddScheduleModal";
import CalendarCreateCard from "@/components/sections/admin/calendar/CalendarCreateCard";
import CalendarEventList from "@/components/sections/admin/calendar/CalendarEventList";
import DeleteScheduleDialog from "@/components/sections/admin/calendar/DeleteScheduleDialog";
import EditScheduleModal from "@/components/sections/admin/calendar/EditScheduleModal";
import ScheduleDetailsModal from "@/components/sections/admin/calendar/ScheduleDetailsModal";
import { useCieCalendar } from "@/hooks/use-cie-calendar";
import { toScheduleCalendarEvents } from "@/lib/utils/calendar-events";
import type { FormAction } from "@/types/administration";
import type { Schedule } from "@/types/calendar";

interface AppCalendarProps {
  schedules: Schedule[];
  createAction: FormAction;
  updateAction: FormAction;
  deleteAction: FormAction;
}

type Dialog =
  | { type: "add"; date?: string }
  | { type: "details" | "edit" | "delete"; schedule: Schedule }
  | null;

/**
 * Wrapper React du calendrier vanilla (FullCalendar) : le hook charge les scripts, appelle
 * init/destroy et garde la grille synchronisée avec `schedules`. Cliquer une case vide ou un
 * créneau ne modifie jamais directement FullCalendar : ça ouvre nos propres modales (Ajouter /
 * Détails / Modifier / Supprimer), qui passent par de vraies Server Actions.
 */
export default function AppCalendar({ schedules, createAction, updateAction, deleteAction }: AppCalendarProps) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const events = useMemo(() => toScheduleCalendarEvents(schedules), [schedules]);
  const { upcoming, past } = useCieCalendar(events);

  useEffect(() => {
    const handleDateClick = (event: Event) => {
      const { dateStr } = (event as CustomEvent<{ dateStr: string }>).detail;
      setDialog({ type: "add", date: dateStr });
    };
    const handleEventClick = (event: Event) => {
      const { id } = (event as CustomEvent<{ id: string }>).detail;
      const schedule = schedules.find((item) => item.publicId === id);
      if (schedule) setDialog({ type: "details", schedule });
    };

    window.addEventListener("cieCalendarDateClicked", handleDateClick);
    window.addEventListener("cieCalendarEventClicked", handleEventClick);
    return () => {
      window.removeEventListener("cieCalendarDateClicked", handleDateClick);
      window.removeEventListener("cieCalendarEventClicked", handleEventClick);
    };
  }, [schedules]);

  const close = () => setDialog(null);

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
          <CalendarCreateCard onAdd={() => setDialog({ type: "add" })} />
          <CalendarEventList title="Créneaux à venir" events={upcoming} emptyLabel="Aucun créneau à venir" />
          <CalendarEventList title="Créneaux passés" events={past} emptyLabel="Aucun créneau passé" />
        </div>
      </div>

      {dialog?.type === "add" && (
        <AddScheduleModal action={createAction} initialDate={dialog.date} isOpen onClose={close} />
      )}
      {dialog?.type === "details" && (
        <ScheduleDetailsModal
          schedule={dialog.schedule}
          isOpen
          onClose={close}
          onEdit={() => setDialog({ type: "edit", schedule: dialog.schedule })}
          onDelete={() => setDialog({ type: "delete", schedule: dialog.schedule })}
        />
      )}
      {dialog?.type === "edit" && (
        <EditScheduleModal schedule={dialog.schedule} action={updateAction} isOpen onClose={close} />
      )}
      {dialog?.type === "delete" && (
        <DeleteScheduleDialog schedule={dialog.schedule} action={deleteAction} isOpen onClose={close} />
      )}
    </>
  );
}
