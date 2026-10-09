import Input from "@/components/ui/form/input/Input";

interface ScheduleFieldsDefaults {
  date: string;
  beginHour: string;
  endHour: string;
  localisation: string;
}

interface ScheduleFormFieldsProps {
  fieldError: (name: string) => string | undefined;
  defaults?: ScheduleFieldsDefaults;
  idPrefix: string;
}

/** Champs partagés par les formulaires d'ajout et de modification d'un créneau. */
export default function ScheduleFormFields({ fieldError, defaults, idPrefix }: ScheduleFormFieldsProps) {
  return (
    <>
      <Input
        id={`${idPrefix}-date`}
        name="date"
        type="date"
        label="Date"
        defaultValue={defaults?.date}
        error={fieldError("date")}
        wrapperClass="mb-3"
        required
      />
      <div className="row">
        <div className="col-6">
          <Input
            id={`${idPrefix}-begin`}
            name="beginHour"
            type="time"
            label="Heure de début"
            defaultValue={defaults?.beginHour}
            error={fieldError("beginHour")}
            wrapperClass="mb-3"
            required
          />
        </div>
        <div className="col-6">
          <Input
            id={`${idPrefix}-end`}
            name="endHour"
            type="time"
            label="Heure de fin"
            defaultValue={defaults?.endHour}
            error={fieldError("endHour")}
            wrapperClass="mb-3"
            required
          />
        </div>
      </div>
      <Input
        id={`${idPrefix}-localisation`}
        name="localisation"
        label="Lieu"
        defaultValue={defaults?.localisation}
        error={fieldError("localisation")}
        wrapperClass="mb-3"
        required
      />
    </>
  );
}
