import Image from "next/image";

interface DropdownItem {
  label: string;
  href?: string;
}

interface ActivityCardProps {
  image: { src: string; alt?: string };
  title: string;
  description: string;
  footer: string;
  buyHref?: string;
  dropdownItems?: DropdownItem[];
  colClass?: string;
}

export default function ActivityCard({
  image,
  title,
  description,
  footer,
  buyHref = "#",
  dropdownItems = [
    { label: "Add to Wishlist" },
    { label: "Compare" },
  ],
  colClass = "col-md-6 col-xl-4",
}: ActivityCardProps) {
  return (
    <div className={colClass}>
      <div className="card">
        <Image
          src={image.src}
          width={400}
          height={267}
          className="card-img-top"
          alt={image.alt ?? ""}
        />

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{title}</h5>
          <div className="dropdown">
            <button
              className="btn btn-light btn-sm"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Actions"
            >
              <i className="ri-more-2-fill" aria-hidden="true"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {dropdownItems.map((item) => (
                <li key={item.label}>
                  <a className="dropdown-item" href={item.href ?? "#"}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card-body">
          <p className="card-text">{description}</p>
          <a href={buyHref} className="btn btn-primary">
            Buy Now
          </a>
        </div>

        <div className="card-footer text-muted">{footer}</div>
      </div>
    </div>
  );
}
