import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { useAuth } from "../context/AuthContext";
import { submitProviderOnboarding } from "../api/provider";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function Icon({ name }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-4.2 3.1-6.2 7-6.2s6.2 2 7 6.2" /></>,
    briefcase: <><rect x="3.5" y="7" width="17" height="12.5" rx="2" /><path d="M8 7V5h8v2M3.5 11h17" /></>,
    shield: <><path d="M12 3.5 20 6v5.5c0 4.7-3.2 8.2-8 9.5-4.8-1.3-8-4.8-8-9.5V6l8-2.5Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    card: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="M3.5 10h17M7 15h4" /></>,
    edit: <><path d="m4 17.5-.8 3.3 3.3-.8L18.7 8.8l-2.5-2.5zM14.8 4.8l2.5 2.5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7h.01" /></>,
  };
  return <svg className="provider-review-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function EditLink({ to }) {
  return <Link to={to} className="provider-review-edit"><Icon name="edit" />Edit</Link>;
}

export default function ProviderSignupPageSeven() {
  const { formData, clearForm } = useForm();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const profilePreview = useMemo(() => {
    const value = formData.providerProfileImage;
    if (typeof value === "string") return value;
    return value?.url || "";
  }, [formData.providerProfileImage]);

  const providerTypeLabel = {
    Individual: "Individual provider",
    "Business/Company": "Business / Company",
    "Team/Agency": "Team / Agency",
  }[formData.providerType] || formData.providerType || "Provider";

  const maskAccount = (value) => value ? `**** ${String(value).slice(-4)}` : "Not provided";

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitProviderOnboarding(formData);
      await refreshUser();
      clearForm();
      navigate("/provider/onboarding/page6");
    } catch (error) {
      setSubmitError(error.message || "Unable to submit your application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="provider-signup-page-container provider-signup-page7">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page7">
          <img src={sideImage} alt="You're almost there" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={5} />
        <div className="provider-signup-form-page7">
          {submitError && <div className="provider-message-error" role="alert">{submitError}</div>}
          <h2 className="provider-signup-step-header">Review and submit</h2>
          <p className="provider-signup-form-step-header-caption">Review your provider application before sending it to the Matchet team.</p>

          <div className="provider-review-grid">
            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="user" /><h3>Your details</h3><EditLink to="/provider/onboarding" /></div>
              <div className="provider-review-details">
                {profilePreview ? <img className="provider-review-avatar" src={profilePreview} alt="Provider profile" /> : <div className="provider-review-avatar provider-review-avatar-placeholder"><Icon name="user" /></div>}
                <div className="provider-review-detail-copy">
                  <strong>{[formData.providerFirstName, formData.providerLastName].filter(Boolean).join(" ") || "Name not provided"}</strong>
                  <span>{providerTypeLabel}</span>
                  <span>✉ {formData.providerEmail || "Email not provided"}</span>
                  <span>⌖ {formData.providerLocation || "Location not provided"}</span>
                </div>
              </div>
            </section>

            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="briefcase" /><h3>About your work</h3><EditLink to="/provider/onboarding/page2" /></div>
              <div className="provider-review-service">
                <div className="provider-review-service-copy">
                  <strong>{formData.providerServiceName || "Work description not provided"}</strong>
                  <span>{formData.providerServiceDesc || "No work description provided."}</span>
                  <span>{formData.providerYearsofExperience || "Experience not provided"} years of experience · {formData.providerAreasofExpertise || "Areas of expertise not provided"}</span>
                </div>
              </div>
            </section>

            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="shield" /><h3>Identity verification</h3><EditLink to="/provider/onboarding/page3" /></div>
              <div className="provider-review-verification"><div><strong>{formData.providerIdType || "ID type not provided"}</strong><span>{formData.providerIdNumber ? "ID number provided" : "ID number not provided"}</span></div><span className="provider-review-status">Ready for review</span></div>
            </section>

            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="card" /><h3>Payment details</h3><EditLink to="/provider/onboarding/page4" /></div>
              <div className="provider-review-payment"><div><strong>{formData.providerBankName || "Bank not provided"}</strong><span>{formData.providerAccountName || [formData.providerFirstName, formData.providerLastName].filter(Boolean).join(" ") || "Account name will be verified"}</span><small>{maskAccount(formData.providerAccountNumber)}</small></div><span className="provider-review-status">Ready for review</span></div>
            </section>
          </div>

          <div className="provider-review-terms"><Icon name="info" /><span>By submitting, you agree to Matchet's <Link to="#">Provider Terms and Conditions</Link>. Your application will be reviewed before you can create services.</span></div>

          <div className="provider-signup-page7-actions">
            <button type="button" className="provider-signup-back-button" onClick={() => navigate("/provider/onboarding/page4")}>←&nbsp;&nbsp;Back</button>
            <button type="button" className="provider-signup-save-continue-button" onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting..." : <>Submit for review&nbsp;&nbsp;→</>}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
