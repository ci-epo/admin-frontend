"use client";

import FormFeedback from "@/components/sections/admin/administration/FormFeedback";
import SettingsFooter from "@/components/sections/admin/administration/SettingsFooter";
import ToggleMessageField from "@/components/sections/admin/administration/ToggleMessageField";
import Input from "@/components/ui/form/input/Input";
import Textarea from "@/components/ui/form/textarea/Textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { SETTINGS_MAX_LENGTH } from "@/lib/schemas/site-settings.schema";
import type { FormAction } from "@/types/administration";
import type { WebSettings } from "@/types/site-settings";

interface WebSettingsFormProps {
  settings: WebSettings;
  action: FormAction;
}

const SOCIAL_FIELDS = [
  { name: "facebookUrl", label: "Page Facebook" },
  { name: "linkedinUrl", label: "Page LinkedIn" },
  { name: "githubUrl", label: "Organisation GitHub" },
] as const;

/** Paramètres du site public (web-frontend) : identité, contacts, maintenance et bandeau d'annonce. */
export default function WebSettingsForm({ settings, action }: WebSettingsFormProps) {
  const { state, isPending, handleSubmit } = useActionForm(action);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form onSubmit={handleSubmit} noValidate className="card position-relative z-1">
      <div className="card-body p-4">
        <FormFeedback state={state} />
        <div className="row g-4">
          <div className="col-xl-6 d-flex flex-column gap-3">
            <h2 className="h6 mb-0">Identité et contact</h2>
            <Input id="site-name" name="siteName" label="Nom du site" required defaultValue={settings.siteName}
              maxLength={SETTINGS_MAX_LENGTH.siteName} error={errors.siteName} />
            <Input id="contact-email" name="contactEmail" type="email" label="E-mail de contact" required
              defaultValue={settings.contactEmail} error={errors.contactEmail} />
            <Textarea id="site-description" name="siteDescription" label="Description (moteurs de recherche, partages)"
              defaultValue={settings.siteDescription} maxLength={SETTINGS_MAX_LENGTH.siteDescription} rows={3} />
            {errors.siteDescription && <div className="invalid-feedback d-block">{errors.siteDescription}</div>}
          </div>
          <div className="col-xl-6 d-flex flex-column gap-3">
            <h2 className="h6 mb-0">Réseaux sociaux</h2>
            <p className="text-muted small mb-0">Laisser un champ vide retire le lien du site.</p>
            {SOCIAL_FIELDS.map((field) => (
              <Input key={field.name} id={field.name} name={field.name} type="url" label={field.label}
                placeholder="https://" defaultValue={settings[field.name]} error={errors[field.name]} />
            ))}
          </div>
          <div className="col-lg-6">
            <ToggleMessageField
              name="maintenance"
              label="Mode maintenance"
              description="Le site public n'affiche plus que ce message (texte par défaut si vide)."
              value={settings.maintenance}
              maxLength={SETTINGS_MAX_LENGTH.maintenanceMessage}
              error={errors.maintenanceMessage}
            />
          </div>
          <div className="col-lg-6">
            <ToggleMessageField
              name="announcement"
              label="Bandeau d'annonce"
              description="Message affiché en haut de toutes les pages du site public."
              value={settings.announcement}
              maxLength={SETTINGS_MAX_LENGTH.announcementMessage}
              error={errors.announcementMessage}
            />
          </div>
        </div>
        <SettingsFooter updatedAt={settings.updatedAt} isPending={isPending} />
      </div>
    </form>
  );
}
