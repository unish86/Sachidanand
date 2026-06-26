import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">&copy; {currentYear} MyStore Inc. All rights reserved.</p>
        <small className="text-muted">
          Built with React &amp; Bootstrap. Clean design &amp; responsive layout.
        </small>
      </div>
    </footer>
  );
}

export default Footer;
