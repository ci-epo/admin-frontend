export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center gap-2">
          <span>
            <span className="footer-year">{year}</span> © CIE.
          </span>
          <div className="text-sm-end d-none d-sm-block">
            Design &amp; Develop by Pixeleyez
          </div>
        </div>
      </div>
    </footer>
  );
}