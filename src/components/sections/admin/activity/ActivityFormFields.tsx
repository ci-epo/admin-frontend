import { ACTIVITY_TYPE_LABEL } from "@/components/ui/card/ActivityCard";
import Input from "@/components/ui/form/input/Input";
import Textarea from "@/components/ui/form/textarea/Textarea";
import type { ActivityFormOptions, ActivityType } from "@/types/activity";

interface ActivityFieldsDefaults {
  name: string;
  type: ActivityType;
  description: string;
  mandateId: string;
  trainerId: string;
  scheduleId: string;
}

interface ActivityFieldsProps {
  options: ActivityFormOptions;
  fieldError: (name: string) => string | undefined;
  defaults?: ActivityFieldsDefaults;
  idPrefix: string;
}

/** Champs partagés par les formulaires d'ajout et de modification d'une activité. */
export default function ActivityFormFields({ options, fieldError, defaults, idPrefix }: ActivityFieldsProps) {
  return (
    <>
      <Input
        id={`${idPrefix}-name`}
        name="name"
        label="Nom"
        defaultValue={defaults?.name}
        error={fieldError("name")}
        wrapperClass="mb-3"
        required
      />
      <div className="mb-3">
        <label htmlFor={`${idPrefix}-type`} className="form-label">
          Type
        </label>
        <select id={`${idPrefix}-type`} name="type" className="form-select" defaultValue={defaults?.type ?? "CONTEST"}>
          {Object.entries(ACTIVITY_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor={`${idPrefix}-mandate`} className="form-label">
          Mandat
        </label>
        <select
          id={`${idPrefix}-mandate`}
          name="mandateId"
          className={`form-select${fieldError("mandateId") ? " is-invalid" : ""}`}
          defaultValue={defaults?.mandateId ?? ""}
        >
          <option value="" disabled>
            Choisir un mandat
          </option>
          {options.mandates.map((mandate) => (
            <option key={mandate.publicId} value={mandate.publicId}>
              {mandate.label}
            </option>
          ))}
        </select>
        {fieldError("mandateId") && <div className="invalid-feedback d-block">{fieldError("mandateId")}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor={`${idPrefix}-trainer`} className="form-label">
          Formateur
        </label>
        <select
          id={`${idPrefix}-trainer`}
          name="trainerId"
          className={`form-select${fieldError("trainerId") ? " is-invalid" : ""}`}
          defaultValue={defaults?.trainerId ?? ""}
        >
          <option value="" disabled>
            Choisir un formateur
          </option>
          {options.trainers.map((trainer) => (
            <option key={trainer.publicId} value={trainer.publicId}>
              {trainer.label}
            </option>
          ))}
        </select>
        {fieldError("trainerId") && <div className="invalid-feedback d-block">{fieldError("trainerId")}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor={`${idPrefix}-schedule`} className="form-label">
          Créneau
        </label>
        <select
          id={`${idPrefix}-schedule`}
          name="scheduleId"
          className={`form-select${fieldError("scheduleId") ? " is-invalid" : ""}`}
          defaultValue={defaults?.scheduleId ?? ""}
        >
          <option value="" disabled>
            Choisir un créneau
          </option>
          {options.schedules.map((schedule) => (
            <option key={schedule.publicId} value={schedule.publicId}>
              {schedule.label}
            </option>
          ))}
        </select>
        {fieldError("scheduleId") && <div className="invalid-feedback d-block">{fieldError("scheduleId")}</div>}
      </div>
      <Textarea
        id={`${idPrefix}-description`}
        name="description"
        label="Description"
        defaultValue={defaults?.description}
        wrapperClass="mb-3"
      />
    </>
  );
}
