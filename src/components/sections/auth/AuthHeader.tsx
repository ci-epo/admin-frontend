import Image from "next/image";
import Link from "next/link";

export default function AuthHeader() {
  return (
    <header className="px-3 px-md-8 py-5 position-absolute top-0 d-flex justify-content-between align-items-center w-100 z-1">
      <Link href="/" className="d-flex align-items-end logo-main">
        <Image
          height={40}
          width={40}
          className="logo-dark"
          alt="Logo Club Informatique de l'EPO (CIE)"
          src="/assets/images/logo-md.png"
        />
        <h3 className="text-body-emphasis fw-bolder mb-0 ms-1">CIE</h3>
      </Link>
      <ul className="list-inline mb-0">
        <li className="list-inline-item pe-4 border-end">
          <Link href="/" className="link-body-emphasis">
            Home
          </Link>
        </li>
        <li className="list-inline-item pe-4 border-end">
          <a href="#" className="link-body-emphasis">
            Support
          </a>
        </li>
        <li className="list-inline-item">
          <a href="#" className="link-body-emphasis">
            Documentation
          </a>
        </li>
      </ul>
    </header>
  );
}