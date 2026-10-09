import { listActivities } from "@/lib/api/activity.endpoints";
import { listMandateOptions, listMemberOptions } from "@/lib/api/office-assignment.endpoints";
import { listSchedules } from "@/lib/api/schedule.endpoints";
import { toScheduleOption } from "@/lib/schemas/schedule.schema";
import type { ActivityFormOptions, ActivityRow } from "@/types/activity";
import type { SelectOption } from "@/types/office-assignment";

export interface ActivityBoard {
  rows: ActivityRow[];
  options: ActivityFormOptions;
}

const EMPTY_BOARD: ActivityBoard = {
  rows: [],
  options: { trainers: [], mandates: [], schedules: [] },
};

function labelOf(options: readonly SelectOption[], publicId: string, unknownLabel: string): string {
  return options.find((option) => option.publicId === publicId)?.label ?? unknownLabel;
}

/**
 * Grille des activités : formateurs (membres), mandats et créneaux sont chargés une fois (ils servent aussi
 * d'options aux formulaires d'ajout/modification) et réutilisés pour résoudre les ids de chaque activité, sans
 * appel par carte.
 */
export async function loadActivityBoard(): Promise<ActivityBoard> {
  try {
    const [members, mandates, rawSchedules, activities] = await Promise.all([
      listMemberOptions(),
      listMandateOptions(),
      listSchedules(),
      listActivities(),
    ]);

    const trainers: SelectOption[] = members.map(({ publicId, label }) => ({ publicId, label }));
    const schedules: SelectOption[] = rawSchedules.map(toScheduleOption);

    const rows: ActivityRow[] = activities.map((activity) => ({
      ...activity,
      trainerName: labelOf(trainers, activity.trainerId, "Formateur inconnu"),
      mandateLabel: labelOf(mandates, activity.mandateId, "Mandat inconnu"),
      scheduleLabel: labelOf(schedules, activity.scheduleId, "Créneau inconnu"),
    }));

    return { rows, options: { trainers, mandates, schedules } };
  } catch (error) {
    console.warn("[activity] grille des activités indisponible", error);
    return EMPTY_BOARD;
  }
}
