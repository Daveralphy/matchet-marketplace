import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { highlightOnboardingFields, saveProviderOnboardingDraft } from "../api/provider";
import { uploadFiles } from "../api/uploads";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function UploadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M8 8l4-4 4 4M5 15v4h14v-4" /></svg>;
}

function LinkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5 14 9.5M8 17.5H6.5a4 4 0 0 1 0-8H10M14 6.5h1.5a4 4 0 0 1 0 8H14" /></svg>;
}

export default function ProviderSignupPageThree() {
  const { formData, updateField, mergeFormData } = useForm();
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, index) => currentYear - index);

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateField(name, value);
  };

  const addFiles = async (files) => {
    const validFiles = Array.from(files || []).filter((file) => {
      if (file.size > 10 * 1024 * 1024) { alert(`"${file.name}" is larger than 10MB and was not added.`); return false; }
      if (!["image/jpeg", "image/png", "image/webp", "video/mp4"].includes(file.type)) { alert(`"${file.name}" is not a supported portfolio file.`); return false; }
      return true;
    });
    if (!validFiles.length) return;
    try {
      const uploaded = await uploadFiles(validFiles, "matchet/portfolio");
      const currentFiles = Array.isArray(formData.providerPortfolioMedia) ? formData.providerPortfolioMedia : [];
      updateField("providerPortfolioMedia", [...currentFiles, ...uploaded].slice(0, 10));
    } catch (error) { alert(error.message || "Unable to upload portfolio media."); }
  };

  useEffect(() => {
    const files = formData.providerPortfolioMedia || [];
    const next = files.slice(0, 3).map((file) => ({
      file,
      url: typeof file === "string" ? file : file?.url || (typeof File !== "undefined" && file instanceof File ? URL.createObjectURL(file) : ""),
    }));
    setPreviews(next);

    return () => {
      next.forEach((item) => {
        if (item.file && typeof File !== "undefined" && item.file instanceof File && item.url?.startsWith("blob:")) URL.revokeObjectURL(item.url);
      });
    };
  }, [formData.providerPortfolioMedia]);

  const removeFile = (index) => {
    const files = [...(formData.providerPortfolioMedia || [])];
    files.splice(index, 1);
    updateField("providerPortfolioMedia", files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    try {
      const response = await saveProviderOnboardingDraft(formData, 3);
      if (response?.data?.formData) mergeFormData(response.data.formData);
      navigate("/provider/onboarding/page4");
    } catch (error) {
      if (error.code === "ONBOARDING_STEP_INCOMPLETE" || error.missingFields?.length) highlightOnboardingFields(error.missingFields);
      alert(error.message || "Please complete the highlighted fields before continuing.");
    }
  };

  return (
    <div className="provider-signup-page-container provider-signup-page3">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page3">
          <img src={sideImage} alt="Show what you can do" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={3} />

        <div className="provider-signup-form-page3">
          <h2 className="provider-signup-step-header">Experience &amp; portfolio</h2>
          <p className="provider-signup-form-step-header-caption">
            Help customers get to know your work, skills, and experience.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="provider-signup-form-field-group">
              <p className="provider-signup-form-field-group-name">Work experience</p>
              <p className="provider-signup-form-step-header-caption">
                Tell us about your experience and qualifications (if applicable).
              </p>

              <label htmlFor="providerYearsofExperience">
                Years of experience *
                <select id="providerYearsofExperience" name="providerYearsofExperience" value={formData.providerYearsofExperience || ""} onChange={handleChange} required>
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
                <input type="text" id="providerAreasofExpertise" name="providerAreasofExpertise" placeholder="e.g. Residential cleaning, Office cleaning, Deep cleaning" value={formData.providerAreasofExpertise || ""} onChange={handleChange} required />
              </label>

              <div className="provider-signup-certification-row">
                <label htmlFor="providerCertification">
                  Certifications (if applicable)
                  <input type="text" id="providerCertification" name="providerCertification" placeholder="Add certification name" value={formData.providerCertification || ""} onChange={handleChange} />
                </label>

                <label htmlFor="providerCertificationIssuingOrg">
                  Issuing organization
                  <input type="text" id="providerCertificationIssuingOrg" name="providerCertificationIssuingOrg" value={formData.providerCertificationIssuingOrg || ""} onChange={handleChange} />
                </label>

                <label htmlFor="providerCertificationYearObtained">
                  Year obtained
                  <select id="providerCertificationYearObtained" name="providerCertificationYearObtained" value={formData.providerCertificationYearObtained || ""} onChange={handleChange}>
                    <option value="" disabled>Select year</option>
                    {years.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
              </div>

              <p className="provider-add-another-certification-note">You can add additional certifications to your provider profile after onboarding.</p>
            </div>

            <div className="provider-signup-form-field-group">
              <p className="provider-signup-form-field-group-name">Portfolio</p>
              <p className="provider-signup-form-step-header-caption">
                Showcase your best work. You can upload photos, videos, or add a link to your portfolio.
              </p>

              <div className="provider-portfolio-section">
                <label
                  className="provider-portfolio-upload"
                  htmlFor="providerPortfolioMedia"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    addFiles(event.dataTransfer.files);
                  }}
                >
                  <UploadIcon />
                  <strong>Upload photos or videos</strong>
                  <span>Drag and drop files here, or <em>click to browse</em><br />JPG, PNG, MP4 or WebP. Max 10MB per file.</span>
                  <input id="providerPortfolioMedia" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4" onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} hidden />
                </label>

                <div className="provider-portfolio-link-box">
                  <label htmlFor="providerPortfolioLink">Portfolio link (optional)</label>
                  <div className="provider-portfolio-link-input">
                    <LinkIcon />
                    <input type="url" id="providerPortfolioLink" name="providerPortfolioLink" placeholder="https://yourwebsite.com or portfolio link" value={formData.providerPortfolioLink || ""} onChange={handleChange} />
                  </div>
                </div>

                {previews.map((item, index) => (
                  <div className="provider-portfolio-preview" key={`${item.url}-${index}`}>
                    {(item.file?.type === "video/mp4" || item.file?.mimeType === "video/mp4") ? <video src={item.url} muted /> : item.url ? <img src={item.url} alt={`Portfolio preview ${index + 1}`} /> : <span>Preview unavailable</span> }
                    <button type="button" className="provider-portfolio-remove" onClick={() => removeFile(index)} aria-label={`Remove portfolio file ${index + 1}`}>×</button>
                  </div>
                ))}

                {(formData.providerPortfolioMedia || []).length > 3 && (
                  <div className="provider-portfolio-more">+{formData.providerPortfolioMedia.length - 3} more</div>
                )}
              </div>
            </div>

            <div className="provider-signup-page3-actions">
              <button type="button" className="provider-signup-back-button" onClick={() => navigate("/provider/onboarding/page2")}>←&nbsp;&nbsp;Back</button>
              <button type="submit" className="provider-signup-save-continue-button">Save &amp; continue&nbsp;&nbsp;→</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
