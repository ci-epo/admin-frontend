import Image from "next/image";

interface LatestProductProps {
  productCategory: string;
  productName: string;
  productImage: string;
  bannerImage: string;
}

export default function LatestProduct({
  productCategory,
  productName,
  productImage,
  bannerImage,
}: LatestProductProps) {
  return (
    <div className="row">
      {/* Latest Product card */}
      <div className="col-12">
        <div className="card">
          <div className="card-header pb-4 mb-2">
            <h4>Latest Product</h4>
            <div className="dropdown">
              <a
                href="#"
                data-bs-toggle="dropdown"
                className="text-muted"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    This Week
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    This Month
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    This Year
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="card-body product-body bg-body m-4 mt-0">
            <Image
              src={productImage}
              width={400}
              height={300}
              className="img-fluid mx-auto d-block product-img1"
              alt="Product Image"
            />
            <div className="m-4 mt-0 py-2 px-4 product-gradient">
              <div>
                <span className="fs-12">{productCategory}</span>
                <p className="fs-5 mb-0">{productName}</p>
              </div>
              <div>
                <i className="bi bi-arrow-right-circle-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login banner card */}
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-center">
              <Image
                src={bannerImage}
                width={400}
                height={300}
                className="img-fluid"
                alt="Enhanced Image"
              />
            </div>
            <div className="d-flex gap-3 pt-4">
              <a href="#" className="btn btn-outline-primary w-50">
                Login / Sign Up
              </a>
              <a href="#" className="btn btn-primary w-50">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}