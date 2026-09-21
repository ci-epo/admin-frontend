import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/components/sections/admin/header/types";

interface CartDropdownProps {
  items: CartItem[];
  viewCartHref?: string;
  checkoutHref?: string;
}

export default function CartDropdown({
  items,
  viewCartHref = "#",
  checkoutHref = "#",
}: CartDropdownProps) {
  const total = items.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0,
  );

  return (
    <div className="dropdown pe-dropdown-mega d-none d-md-block">
      <button
        className="btn btn-icon header-btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Cart"
      >
        <i className="bi bi-cart position-relative"></i>
        <div className="icon-dot"></div>
      </button>

      <ul className="dropdown-menu dropdown-mega-md header-dropdown-menu p-0">
        <div className="card mb-0">
          <div className="p-5 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="card-title">Cart Items</h5>
            <span className="badge text-primary bg-primary-subtle">
              {items.length}
            </span>
          </div>

          <ul
            className="list-unstyled list-none mb-0 p-4"
            id="header-cart-items-scroll"
          >
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="d-flex items-start cart-dropdown-item">
                  <Image
                    src={item.imageUrl}
                    width={48}
                    height={48}
                    className="avatar-lg me-4 p-1 rounded border"
                    alt={item.name}
                  />
                  <div className="flex-grow-1">
                    <div>
                      <h6>
                        <Link href={item.href ?? "#"} className="text-reset">
                          {item.name}
                        </Link>
                      </h6>
                      <p className="mb-0 fs-12 text-muted">
                        Quantity:{" "}
                        <span>
                          {item.quantity} x ${item.unitPrice}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center px-2">
                    <h6 className="m-0 fw-normal">
                      $
                      <span className="cart-item-price">
                        {item.unitPrice * item.quantity}
                      </span>
                    </h6>
                  </div>
                  <div className="ps-2 d-flex">
                    <button
                      type="button"
                      className="btn btn-sm"
                      aria-label="Remove item"
                    >
                      <i className="ri-close-fill fs-16"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 bg-light-subtle d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Order Total:</h6>
            <span className="fw-semibold">${total.toFixed(2)}</span>
          </div>

          <div className="p-5 d-flex justify-content-end gap-3">
            <Link className="btn btn-light" href={viewCartHref}>
              View Cart
            </Link>
            <Link className="btn btn-primary view-checkout" href={checkoutHref}>
              Checkout
            </Link>
          </div>
        </div>
      </ul>
    </div>
  );
}