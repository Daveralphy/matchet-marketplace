import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import { saveProviderOnboardingDraft } from "../../api/provider";

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.5h11.5L19 7v12.5H5z" />
      <path d="M8 4.5v5h8v-5M9 19.5v-5h6v5" />
    </svg>
  );
}

function ProviderSignupFormHeader({ step }) {
  const navigate = useNavigate();
  const { formData } = useForm();
  const stepsData = [
    { num: 1, label: "Your Details" },
    { num: 2, label: "Services" },
    { num: 3, label: "Experience" },
    { num: 4, label: "Availability" },
    { num: 5, label: "Verification" },
    { num: 6, label: "Payment" },
    { num: 7, label: "Review" },
  ];

  return (
    <header className="provider-signup-form-header">
      <div className="provider-signup-form-heading-row">
        <Link to="/for-providers" className="provider-signup-breadcrumb"><span aria-hidden="true">←</span><span>For Providers</span></Link>
        <button type="button" className="provider-signup-save-and-exit" onClick={async () => {
          try {
            await saveProviderOnboardingDraft(formData);
            navigate("/for-providers", { replace: true });
          } catch (error) {
            window.alert(error.message || "Unable to save your progress. Please try again.");
          }
        }}>
          <SaveIcon />
          Save and exit
        </button>
      </div>

      <div className="provider-signup-form-heading-copy">
        <h1>Become a provider</h1>
        <p className="provider-signup-form-header-caption">
          Set up your provider profile and start offering your services on Matchet.
        </p>
      </div>

      <div className="provider-signup-stepper" aria-label="Provider onboarding progress">
        <div className="provider-signup-stepper-track" />
        {stepsData.map((item) => {
          const complete = item.num < step;
          const current = item.num === step;
          return (
            <div key={item.num} className={`provider-signup-stepper-item ${complete ? "is-complete" : ""} ${current ? "is-current" : ""}`}>
              <div className="provider-signup-stepper-dot">{complete ? "✓" : item.num}</div>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <p className="provider-signup-step-counter">Step {step} of 7</p>
    </header>
  );
}

export default ProviderSignupFormHeader;
