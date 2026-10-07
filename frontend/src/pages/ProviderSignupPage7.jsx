import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    document: <><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v5h4M9 13h6M9 16h6" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3.5v4M16.5 3.5v4M3.5 9h17M8 13h3M13 13h3M8 17h3" /></>,
    shield: <><path d="M12 3.5 20 6v5.5c0 4.7-3.2 8.2-8 9.5-4.8-1.3-8-4.8-8-9.5V6l8-2.5Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    card: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="M3.5 10h17M7 15h4" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    location: <><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    map: <><path d="m3.5 6.5 5-2 7 2 5-2v13l-5 2-7-2-5 2zM8.5 4.5v13M15.5 6.5v13" /></>,
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

  const profilePreview = useMemo(() => {
    const file = formData.providerProfileImage;
    if (!file) return null;
    if (typeof file === "string") return file;
    if (file && typeof file === "object" && file.url) return file.url;
    if (typeof File !== "undefined" && file instanceof File) return URL.createObjectURL(file);
    return null;
  }, [formData.providerProfileImage]);

  const portfolioPreviews = useMemo(() => (Array.isArray(formData.providerPortfolioMedia) ? formData.providerPortfolioMedia : []).slice(0, 3).map((file) => ({
    file,
    url: typeof file === "string" ? file : file?.url || (typeof File !== "undefined" && file instanceof File ? URL.createObjectURL(file) : ""),
  })), [formData.providerPortfolioMedia]);

  useEffect(() => {
    return () => {
      if (profilePreview && formData.providerProfileImage && typeof formData.providerProfileImage !== "string" && !formData.providerProfileImage.url) URL.revokeObjectURL(profilePreview);
      portfolioPreviews.forEach(({ file, url }) => {
        if (file && typeof file !== "string" && !file.url) URL.revokeObjectURL(url);
      });
    };
  }, [profilePreview, portfolioPreviews, formData.providerProfileImage]);

  const maskAccount = (value) => value ? "**** " + String(value).slice(-4) : "Not provided";
  const providerTypeLabel = { Individual: "Individual provider", "Business/Company": "Business / Company", "Team/Agency": "Team / Agency", individual: "Individual provider", business: "Business / Company", team: "Team / Agency" }[formData.providerType] || formData.providerType || "Provider";

  const weekdayData = ["monday", "tuesday", "wednesday", "thursday", "friday"].map((day) => formData.providerAvailability?.[day]).filter(Boolean);
  const weekdayEnabled = weekdayData.filter((day) => day.enabled);
  const weekdaySummary = weekdayEnabled.length === 0
    ? "Not available"
    : weekdayEnabled.length < 5
      ? "Varies"
      : weekdayEnabled.every((day) => day.startTime === weekdayEnabled[0].startTime && day.endTime === weekdayEnabled[0].endTime)
        ? (weekdayEnabled[0].startTime || "Not set") + " - " + (weekdayEnabled[0].endTime || "Not set")
        : "Various";

  const weekendSummary = (key) => {
    const day = formData.providerAvailability?.[key];
    return day?.enabled ? (day.startTime || "Not set") + " - " + (day.endTime || "Not set") : "Not available";
  };

  const serviceAreaLabel = {
    specificLocations: "Specific locations",
    radius: "Within a radius",
    remote: "Remote / Online only",
  }[formData.providerServiceArea] || "Not specified";

  const serviceAreaDescription = formData.providerServiceArea === "specificLocations"
    ? ((formData.providerServiceAreaSpecificLocations || []).join(", ") || "None specified")
    : formData.providerServiceArea === "radius"
      ? (formData.providerServiceAreaRadius || "0") + " km radius of " + (formData.providerLocation || "your location")
      : formData.providerServiceArea === "remote"
        ? "Remote / Online only"
        : "Not specified";

  return (
    <div className="provider-signup-page-container provider-signup-page7">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page7">
          <img src={sideImage} alt="You're almost there" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={5} />

        <div className="provider-signup-form-page7">{submitError && <div className="provider-message-error" role="alert">{submitError}</div>}
          <h2 className="provider-signup-step-header">Review and submit</h2>
          <p className="provider-signup-form-step-header-caption">Please review your information below. You can go back and make changes if needed.</p>

          <div className="provider-review-grid">
            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="shield" /><h3>Identity verification</h3><EditLink to="/provider/onboarding/page3" /></div>
              <div className="provider-review-verification"><div><strong>{formData.providerIdType || "ID type not provided"}</strong><span>{formData.providerIdNumber ? "ID number provided" : "ID number not provided"}</span></div><span className="provider-review-status">Ready for review</span></div>
            </section>

            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="user" /><h3>Your details</h3><EditLink to="/provider/onboarding" /></div>
              <div className="provider-review-details">
                {profilePreview ? <img className="provider-review-avatar" src={profilePreview} alt="Provider profile" /> : <div className="provider-review-avatar provider-review-avatar-placeholder"><Icon name="user" /></div>}
                <div className="provider-review-detail-copy">
                  <strong>{[formData.providerFirstName, formData.providerLastName].filter(Boolean).join(" ") || "Name not provided"}</strong>
                  <span>{providerTypeLabel}</span>
                  <span>✉ {formData.providerEmail || "Email not provided"}</span>
                  <span>⌕ {[formData.providerCountryCode, formData.providerPhoneNumber].filter(Boolean).join(" ") || "Phone not provided"}</span>
                  <span>⌖ {formData.providerLocation || "Location not provided"}</span>
                </div>
              </div>
            </section>

            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="briefcase" /><h3>Your services</h3><EditLink to="/provider/onboarding/page2" /></div>
              <div className="provider-review-service">
                <div className="provider-review-service-number">1.</div>
                <div className="provider-review-service-copy"><strong>{formData.providerServiceName || "Service name not provided"}</strong><span>{formData.providerServiceDesc || "No service description provided."}</span></div>
                <strong className="provider-review-price">From ₦{formData.providerServicePrice || "0"}</strong><span className="provider-review-chevron">›</span>
              </div>
            </section>

            <section className="provider-review-card">
              <div className="provider-review-card-heading"><Icon name="briefcase" /><h3>About your work</h3><EditLink to="/provider/onboarding/page2" /></div>
              <div className="provider-review-service">
                <div className="provider-review-service-copy"><strong>{formData.providerServiceName || "Work description not provided"}</strong><span>{formData.providerServiceDesc || "No work description provided."}</span><span>{formData.providerYearsofExperience || "Experience not provided"} years of experience · {formData.providerAreasofExpertise || "Areas of expertise not provided"}</span></div>
              </div>
            </section>

            
