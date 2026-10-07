import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { highlightOnboardingFields, saveProviderOnboardingDraft } from "../api/provider";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

export default function ProviderSignupPageThree() {
  const { formData, updateField, mergeFormData } = useForm();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, index) => currentYear - index);

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateField(name, value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    try {
      const response = await saveProviderOnboardingDraft(formData, 2);
      if (response?.data?.formData) mergeFormData(response.data.formData);
      navigate("/provider/onboarding/page3");
    } catch (error) {
      if (error.code === "ONBOARDING_STEP_INCOMPLETE" || error.missingFields?.length) {
        highlightOnboardingFields(error.missingFields);
      }
      alert(error.message || "Please complete the highlighted fields before continuing.");
    }
  };

  return (
    <div className="provider-signup-page-container provider-signup-page3">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page3">
          <img src={sideImage} alt="Tell customers about you" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={2} />

        <div className="provider-signup-form-page3">
          <h2 className="provider-signup-step-header">Tell us about what you do</h2>
          <p className="provider-signup-form-step-header-caption">
            Describe your work and experience. You can create your individual services after your provider account is approved.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="provider-signup-form-field-group">
              <p className="provider-signup-form-field-group-name">Your work</p>
              <p className="provider-signup-form-step-header-caption">
                This is about you as a provider, not a service listing.
              </p>

              <label htmlFor="providerServiceName">
                What do you do? *
                <input
                  type="text"
                  id="providerServiceName"
                  name="providerServiceName"
                  placeholder="e.g. Professional barber, Web designer, Clipper repair technician"
                  value={formData.providerServiceName || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="providerServiceDesc">
                Tell us about your work *
                <textarea
                  id="providerServiceDesc"
                  name="providerServiceDesc"
                  rows="5"
                  maxLength="1000"
                  placeholder="Describe what you do, your experience, the kind of work you handle, and what customers should know about you."
                  value={formData.providerServiceDesc || ""}
                  onChange={handleChange}
                  required
                />
                <span className="provider-signup-service-character-count">
                  {(formData.providerServiceDesc || "").length}/1000
                </span>
              </label>

              <label htmlFor="providerYearsofExperience">
                Years of experience *
                <select
                  id="providerYearsofExperience"
                  name="providerYearsofExperience"
                  value={formData.providerYearsofExperience || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select years of experience</option>
                  <option value="1 or less">Less than 1</option>
                  <option value="1-3">1-3</option>
                  <option value="3-5">3-5</option>
                  <option value="5-10">5-10</option>
                  <option value="10+">10+</option>
                </select>
              </label>

              <label htmlFor="providerAreasofExpertise">
                Areas of expertise *
                <input
                  type="text"
                  id="providerAreasofExpertise"
                  name="providerAreasofExpertise"
                  placeholder="e.g. Fades, beard grooming, clipper maintenance"
                  value={formData.providerAreasofExpertise || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="provider-signup-certification-row">
                <label htmlFor="providerCertification">
                  Certification (if applicable)
                  <input
                    type="text"
                    id="providerCertification"
                    name="providerCertification"
                    placeholder="Add certification name"
                    value={formData.providerCertification || ""}
                    onChange={handleChange}
                  />
                </label>

                <label htmlFor="providerCertificationIssuingOrg">
                  Issuing organization
                  <input
                    type="text"
                    id="providerCertificationIssuingOrg"
                    name="providerCertificationIssuingOrg"
                    value={formData.providerCertificationIssuingOrg || ""}
                    onChange={handleChange}
                  />
                </label>

                <label htmlFor="providerCertificationYearObtained">
                  Year obtained
                  <select
                    id="providerCertificationYearObtained"
                    name="providerCertificationYearObtained"
                    value={formData.providerCertificationYearObtained || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select year</option>
                    {years.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="provider-signup-page3-actions">
              <button type="button" className="provider-signup-back-button" onClick={() => navigate("/provider/onboarding/page2")}>
                ←&nbsp;&nbsp;Back
              </button>
              <button type="submit" className="provider-signup-save-continue-button">
                Save &amp; continue&nbsp;&nbsp;→
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
