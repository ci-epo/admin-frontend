import Image from "next/image";

interface ProfileAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: string; // classe btn ex: "btn-light", "btn-light-primary"
}

interface ProfileCardProps {
  avatar: { src: string; alt?: string };
  person: { name: string; role: string; company: string };
  skills?: { items: string[]; badgeColor?: string };   // badgeColor ex: "bg-info", "bg-primary"
  details?: { location?: string; experience?: string; education?: string };
  actions?: ProfileAction[];
  className?: string;
}

export default function ProfileCard({
  avatar,
  person,
  skills,
  details = {},
  actions = [],
  className = "",
}: ProfileCardProps) {
  const { name, role, company } = person;
  const { items: skillItems = [], badgeColor: skillBadgeColor = "bg-info" } = skills ?? {};
  const { location, experience, education } = details;

  return (
    <div className={`col-md-6 col-xl-3 ${className}`.trim()}>
      <div className="card h-100">
        <div className="card-body text-center p-4 rounded">

          {/* Avatar */}
          <div className="avatar-item d-flex mx-auto w-max border-primary">
            <Image
              className="img-fluid avatar-xl"
              src={avatar.src}
              width={72}
              height={72}
              alt={avatar.alt ?? "avatar image"}
            />
          </div>

          {/* Nom & poste */}
          <h5 className="card-title fw-semibold mt-3">{name}</h5>
          <p className="card-text text-muted">
            {role} at <strong>{company}</strong>
          </p>

          {/* Skills */}
          {skillItems.length > 0 && (
            <div className="skills mb-3">
              <strong>✨ Skills:</strong>
              <ul className="list-unstyled d-flex justify-content-center flex-wrap mt-2">
                {skillItems.map((skill) => (
                  <li key={skill} className={`badge ${skillBadgeColor} me-1`}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Infos */}
          {location   && <p className="card-text"><strong>📍 Location:</strong> {location}</p>}
          {experience && <p className="card-text"><strong>💼 Experience:</strong> {experience}</p>}
          {education  && <p className="card-text"><strong>🎓 Education:</strong> {education}</p>}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="d-flex justify-content-center mt-5 gap-2">
              {actions.map((action, i) => (
                <a
                  key={i}
                  href={action.onClick ? undefined : (action.href ?? "#")}
                  role={action.onClick ? "button" : undefined}
                  onClick={action.onClick}
                  className={`btn ${action.variant ?? "btn-light"}`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}