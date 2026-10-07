// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect } from "react";
import { Link } from "react-router-dom";

const steps = [
  "Your Details",
  "Business Info",
  "Verification",
  "Payment",
  "Review",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6.5 12.5 3.5 3.5 7.5-8" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.5h10.5L19 8v11.5H5z" />
      <path d="M8 4.5v5h7v-5M9 19v-5h6v5M17 7h.01" />
    </svg>
  );
}

export default function SellerSignupFormHeader({ step }) {
  useEffect(() => { const labels = ["Your Details","Business Info","Verification","Payment","Review"]; document.title = `${labels[step - 1] || "Seller Application"} | Matchet`; }, [step]);
  useEffect(() => {
    const scroller = document.querySelector(".seller-signup-right-section");
    if (!scroller) return undefined;
    let timer;
    const handleScroll = () => {
      scroller.classList.add("is-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => scroller.classList.remove("is-scrolling"), 700);
    };
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.clearTimeout(timer);
    };
  }, []);


  return (
    <header className="seller-signup-form-header">
      <div className="seller-signup-form-heading-row">
        <Link to="/" className="seller-signup-breadcrumb"><span aria-hidden="true">←</span><span>For Sellers</span></Link>
        <Link to="/for-providers" className="seller-signup-save-and-exit">
          <SaveIcon />
          <span>Save and exit</span>
        </Link>
      </div>

      <div className="seller-signup-form-heading-copy">
        <h1>Become a seller</h1>
        <p>Set up your seller profile and start selling your products on Matchet.</p>
      </div>

      <div className="seller-signup-stepper">
        <div className="seller-signup-stepper-track" />
        {steps.map((label, index) => {
          const number = index + 1;
          const complete = number < step;
          const current = number === step;

          return (
            <div
              key={label}
              className={[
                "seller-signup-stepper-item",
                complete ? "is-complete" : "",
                current ? "is-current" : "",
              ].join(" ")}
            >
              <div className="seller-signup-stepper-dot">
                {complete ? <CheckIcon /> : number}
              </div>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </header>
  );
}
