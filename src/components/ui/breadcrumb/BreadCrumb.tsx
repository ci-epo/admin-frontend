interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  title: string;
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ title, items }: BreadcrumbProps) {
  return (
    <div className="main-breadcrumb d-flex align-items-center my-3 position-relative">
      <h2 className="breadcrumb-title mb-0 flex-grow-1 fs-14">{title}</h2>
      <div className="flex-shrink-0">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb justify-content-end mb-0">
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              return (
                <li
                  key={idx}
                  className={`breadcrumb-item${isLast ? " active" : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {isLast || !item.href ? (
                    item.label
                  ) : (
                    <a href={item.href}>{item.label}</a>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}