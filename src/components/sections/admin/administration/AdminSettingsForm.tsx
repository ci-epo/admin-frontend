"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SettingsFooter from "@/components/sections/admin/administration/SettingsFooter";
import ToggleMessageField from "@/components/sections/admin/administration/ToggleMessageField";
import Switch from "@/components/ui/form/switch/Switch";
import { useActionForm } from "@/hooks/use-action-form";
import { SETTINGS_MAX_LENGTH } from "@/lib/schemas/site-settings.schema";
import type { AdminModule, FormAction } from "@/types/administration";
import type { AdminSettings } from "@/types/site-settings";

interface AdminSettingsFormProps {
  settings: AdminSettings;
  /** Modules du menu qu'on peut désactiver (le tableau de bord et l'administration restent toujours actifs). */
  modules: AdminModule[];
  action: FormAction;
}

/** Paramètres de l'espace d'administration (admin-frontend) : bandeau pour l'équipe et modules actifs. */
export default function AdminSettingsForm({ settings, modules, action }: AdminSettingsFormProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const hidden = new Set(settings.hiddenModules);

  return (
    <form onSubmit={handleSubmit} noValidate className="card position-relative z-1">
      <div className="card-body p-4">
        <FormFeedback state={state} />
        <div className="row g-4">
          <div className="col-lg-6">
            <ToggleMessageField
              name="announcement"
              label="Bandeau pour l'équipe"
              description="Message affiché en haut de toutes les pages de l'administration."
              value={settings.announcement}
              maxLength={SETTINGS_MAX_LENGTH.announcementMessage}
              error={errors.announcementMessage}
            />
          </div>
          <div className="col-lg-6">
            <fieldset className="border rounded-3 p-3 h-100">
              <legend className="h6 float-none w-auto px-1 mb-1 fs-6">Modules actifs</legend>
              <p className="text-muted small">
                Un module désactivé disparaît du menu et sa page affiche « Page introuvable ». Ses données sont conservées.
              </p>
              <div className="d-flex flex-column gap-2">
                {modules.map((module) => (
                  <Switch
                    key={module.key}
                    id={`module-${module.key}`}
                    name="activeModules"
                    value={module.key}
                    label={module.label}
                    defaultChecked={!hidden.has(module.key)}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        </div>
        <SettingsFooter updatedAt={settings.updatedAt} isPending={isPending} />
      </div>
    </form>
  );
}
