import type { AboutRole } from "@/components/sections/admin/about/types";

interface AboutRolesProps {
  roles: AboutRole[];
}

export default function AboutRoles({ roles }: AboutRolesProps) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="ri-shield-keyhole-line me-2 text-primary"></i>Rôles &amp; permissions
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table align-middle mb-0 about-roles-table">
            <thead>
              <tr>
                <th scope="col">Rôle</th>
                <th scope="col">Description</th>
                <th scope="col">Accès principaux</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.role}>
                  <td>
                    <span className={`badge ${r.badgeClass}`}>{r.role}</span>
                  </td>
                  <td className="text-muted small">{r.description}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {r.permissions.map((p) => (
                        <span key={p} className="badge bg-light text-muted">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
