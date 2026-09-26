// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { Link } from "react-router-dom";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

function SuccessIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" />
      <path d="m20 32 8 8 17-18" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="14" cy="14" r="8.5" />
      <path d="m20 20 7 7" />
      <path d="M14 10v8M10 14h8" />
    </svg>
  );
}

function UpdateIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="7" width="24" height="18" rx="3" />
      <path d="m5 9 11 9L27 9" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 12h22l-2-6H7z" />
      <path d="M6 12v14h20V12" />
      <path d="M11 26V17h10v9" />
      <path d="M4 12c0 3 2 5 5 5s5-2 5-5c0 3 2 5 5 5s5-2 5-5c0 3 2 5 5 5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" />
      <path d="M16 14v9" />
      <path d="M16 9h.01" />
    </svg>
  );
}

export default function SellerSignupPageEight() {
  return (
    <div className="seller-signup-page-container seller-signup-page8">
      <section className="seller-signup-left-section">
        <SellerSignupSideImage />
      </section>

      <section className="seller-signup-right-section">
        <SellerSignupFormHeader step={7} />

        <main className="seller-signup-submission-content">
          <section className="seller-signup-submission-hero">
            <div className="seller-signup-submission-success-icon">
              <SuccessIcon />
            </div>

            <h2>Your application has been submitted</h2>

            <p>
              Thank you for applying to become a seller on Matchet.
              <br />
              We've received your information and it is now under review.
            </p>

            <div className="seller-signup-next-steps-card">
              <h3>What happens next?</h3>

              <div className="seller-signup-next-steps-grid">
                <article className="seller-signup-next-step">
                  <div className="seller-signup-next-step-icon seller-signup-next-step-icon-blue">
                    <ReviewIcon />
                  </div>

                  <h4>We review your application</h4>

                  <p>
                    Our team will review your information, documents, and
                    products to make sure they meet our seller standards.
                  </p>

                  <span>1–3 business days</span>
                </article>

                <article className="seller-signup-next-step">
                  <div className="seller-signup-next-step-icon seller-signup-next-step-icon-green">
                    <UpdateIcon />
                  </div>

                  <h4>You'll get an update</h4>

                  <p>
                    We'll notify you by email and in-app once a decision has
                    been made.
                  </p>
                </article>

                <article className="seller-signup-next-step">
                  <div className="seller-signup-next-step-icon seller-signup-next-step-icon-purple">
                    <StoreIcon />
                  </div>

                  <h4>Start selling</h4>

                  <p>
                    Once approved, you can go live, manage your products, and
                    start reaching customers on Matchet.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <div className="seller-signup-submission-info">
            <InfoIcon />

            <div>
              <strong>
                You can check the status of your application anytime from your
                dashboard.
              </strong>
              <p>If we need any additional information, we'll reach out.</p>
            </div>
          </div>

          <div className="seller-signup-submission-actions">
            <Link
              to="/provider/dashboard"
              className="seller-signup-dashboard-button"
            >
              Go to dashboard
            </Link>

            <Link to="/" className="seller-signup-home-button">
              Back to home
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </main>
      </section>
    </div>
  );
}
