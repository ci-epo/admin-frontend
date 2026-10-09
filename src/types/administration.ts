/** Résultat d'une Server Action de la page Administration, affiché par le formulaire qui l'a déclenchée. */
export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

/** Onglets de la page Administration (paramètre d'URL `onglet`). */
export type AdministrationTab = "site" | "admin" | "droits" | "sauvegardes";

/** Module de l'administration qu'on peut désactiver (entrée du menu). */
export interface AdminModule {
  key: string;
  label: string;
}

/** Données d'un onglet, chargées par la page (Server Component). */
export type AdministrationPanelData<TWeb, TAdmin, TBackup, TMatrix> =
  | { tab: "site"; web: TWeb }
  | { tab: "admin"; admin: TAdmin }
  | { tab: "droits"; matrix: TMatrix }
  | { tab: "sauvegardes"; backups: TBackup[] };

export type AdministrationLoadResult<TData> = { status: "ready"; data: TData } | { status: "error"; message: string };

/** Server Action d'un formulaire de la page Administration (transmise par la page aux composants). */
export type FormAction = (state: ActionState, form: FormData) => Promise<ActionState>;
