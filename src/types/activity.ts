import type { SelectOption } from "@/types/office-assignment";

/** `ActivityTypeEnum` d'`app-service` (`schema.prisma`). */
export type ActivityType = "CONTEST" | "TRAINING" | "PROJECT";

export interface Activity {
  publicId: string;
  mandateId: string;
  trainerId: string;
  scheduleId: string;
  name: string;
  type: ActivityType;
  description?: string;
}

/** Ligne affichée dans la grille des activités (ids résolus en libellés, sans appel par carte). */
export interface ActivityRow extends Activity {
  mandateLabel: string;
  trainerName: string;
  scheduleLabel: string;
}

export interface ActivityFormOptions {
  trainers: SelectOption[];
  mandates: SelectOption[];
  schedules: SelectOption[];
}

export interface CreateActivityCommand {
  mandateId: string;
  trainerId: string;
  scheduleId: string;
  name: string;
  type: ActivityType;
  description?: string;
}

export type UpdateActivityCommand = Partial<CreateActivityCommand>;
