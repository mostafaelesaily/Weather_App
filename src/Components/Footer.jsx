// CreatedBy.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const CreatedBy = ({ theme = "light" }) => {
  return (
    <footer
      className={`py-4 mt-auto ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{
        boxShadow:
          theme === "dark"
            ? "0 -5px 15px rgba(255, 255, 255, 0.05)"
            : "0 -5px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 fs-5">
              <span className="text-muted">Weather App by </span>{" "}
              <strong className="gradient-text">
                {" "}
                SWE / Mostafa El Esialy
              </strong>
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-4">
              <a
                href="https://www.facebook.com/share/19MjMg6DCU/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  theme === "dark" ? "text-white" : "text-dark"
                } hover-effect`}
                style={{ fontSize: "1.5rem" }}
                aria-label="Facebook profile"
              >
                <i className="fab fa-facebook"></i>
              </a>

              <a
                href="https://www.linkedin.com/in/mostafa-el-esialy-7b7827328"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  theme === "dark" ? "text-white" : "text-dark"
                } hover-effect`}
                style={{ fontSize: "1.5rem" }}
                aria-label="LinkedIn profile"
              >
                <i className="fab fa-linkedin"></i>
              </a>

              <a
                href="https://github.com/mostafaelesaily"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  theme === "dark" ? "text-white" : "text-dark"
                } hover-effect`}
                style={{ fontSize: "1.5rem" }}
                aria-label="GitHub profile"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-3">
          <small className="text-muted">
            © {new Date().getFullYear()} All Rights Reserved
          </small>
        </div>
      </div>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(90deg, #3a7bd5, #00d2ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 600;
        }

        .hover-effect {
          transition: all 0.3s ease;
          opacity: 0.8;
        }

        .hover-effect:hover {
          opacity: 1;
          transform: translateY(-3px);
        }

        .fa-facebook:hover {
          color: #1877f2 !important;
        }

        .fa-linkedin:hover {
          color: #0a66c2 !important;
        }

        .fa-github:hover {
          color: #6e5494 !important;
        }
      `}</style>
    </footer>
  );
};
