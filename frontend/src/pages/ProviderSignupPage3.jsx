// Created by:  Blake Ostler
// Edited by:  Blake Ostler

//TODO:  Need left section image from Raphael
//TODO:  Logic/handling for "+ Add another certification" button, including making sure it is included in the FormContext
//TODO:  Styling

// Got help from Google Gemini on the file upload field. I typed the code myself.

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";

export default function ProviderSignupPageThree() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  // A generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const MAX_SIZE_MB = 10;
  const MAX_FILE_SIZE = MAX_SIZE_MB * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert(
          `"${file.name}" is larger than ${MAX_SIZE_MB}MB and was not added.`,
        );
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      const currentFiles = formData.providerPortfolioMedia || [];
      updateField("providerPortfolioMedia", [...currentFiles, ...validFiles]);
    }
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = [];
    for (const file of droppedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert(
          `"${file.name}" is larger than ${MAX_SIZE_MB}MB and was not added.`,
        );
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      const currentFiles = formData.providerPortfolioMedia || [];
      updateField("providerPortfolioMedia", [...currentFiles, ...validFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (indexToRemove) => {
    const currentFiles = formData.providerPortfolioMedia || [];
    const updatedFiles = currentFiles.filter(
      (_, index) => index !== indexToRemove,
    );
    updateField("providerPortfolioMedia", updatedFiles);
  };

  // "Year obtained" dropdown options
  // Got help from Google Gemini on this. I typed the code myself.
  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index,
  ).reverse();

  //Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    navigate("/provider/onboarding/page4");
  };

  return (
    <div className="provider-signup-page-container provider-signup-page3">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page3">
          <img src="path" alt="Provider sign-up decoration" />
        </div>
      </section>
      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={3} />
        <h2 className="provider-signup-step-header">Experience & portfolio</h2>
        <p className="provider-signup-form-step-header-caption">
          Help customers get to know your work, skills, and experience.
        </p>
        <form className="provider-signup-form-page3" onSubmit={handleSubmit}>
          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">
              Work experience
            </p>
            <p className="provider-signup-form-step-header-caption">
              Tell us about your experience and qualifications (if applicable).
            </p>

            <label htmlFor="providerYearsofExperience">
              Years of experience *
              <select
                id="providerYearsofExperience"
                name="providerYearsofExperience"
                value={formData.providerYearsofExperience}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select years of experience
                </option>
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
                placeholder="e.g. Residential cleaning, Office cleaning, Deep cleaning"
                value={formData.providerAreasofExpertise}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="providerCertification">
              Certifications (if applicable)
              <input
                type="text"
                id="providerCertification"
                name="providerCertification"
                placeholder="Add certification name"
                value={formData.providerCertification}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="providerCertificationIssuingOrg">
              Issuing organization
              <input
                type="text"
                id="providerCertificationIssuingOrg"
                name="providerCertificationIssuingOrg"
                value={formData.providerCertificationIssuingOrg}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="providerCertificationYearObtained">
              Year obtained *
              <select
                id="providerCertificationYearObtained"
                name="providerCertificationYearObtained"
                value={formData.providerCertificationYearObtained}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="provider-add-another-certification-button"
            >
              + Add another certification
            </button>
          </div>

          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">Portfolio</p>
            <p className="provider-signup-form-step-header-caption">
              Showcase your best work. You can upload photos, videos, or add a
              link to your portfolio.
            </p>
            <label
              htmlFor="providerPortfolioMedia"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: "2px dashed #ccc",
                padding: "30px 20px",
                display: "block",
                textAlign: "center",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#fafafa",
                marginTop: "8px",
              }}
            >
              <span
                style={{
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "4px",
                }}
              >
                Upload photos or videos
              </span>
              <span style={{ color: "#555", fontSize: "14px" }}>
                Drag and drop files here, or{" "}
                <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                  click to browse
                </span>
              </span>
              <span style={{ color: "#555", fontSize: "14px" }}>
                JPG, PNG, WebP or MP4. Max 10MB per file.
              </span>

              <input
                type="file"
                id="providerPortfolioMedia"
                name="providerPortfolioMedia"
                multiple
                accept="image/jpeg, image/jpg, image/png, image/webp, video/mp4"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            {formData.providerPortfolioMedia &&
              formData.providerPortfolioMedia.length > 0 && (
                <div
                  className="provider-portfolio-previews"
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "15px",
                    alignItems: "center",
                  }}
                >
                  {formData.providerPortfolioMedia
                    .slice(0, 3)
                    .map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "90px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "80px",
                            height: "80px",
                          }}
                        >
                          {file.type.startsWith("video/") ? (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                background: "#333",
                                color: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                              }}
                            >
                              <span>🎬</span>
                              <span
                                style={{ fontSize: "10px", marginTop: "2px" }}
                              >
                                Video
                              </span>
                            </div>
                          ) : (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Portfolio preview ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                              }}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            style={{
                              position: "absolute",
                              top: "-6px",
                              right: "-6px",
                              background: "#ff4d4d",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "22px",
                              height: "22px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: "bold",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            }}
                            title="Remove file"
                          >
                            x
                          </button>
                        </div>
                      </div>
                    ))}
                  {formData.providerPortfolioMedia.length > 3 && (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "6px",
                        border: "1px dashed #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#555",
                      }}
                    >
                      +{formData.providerPortfolioMedia.length - 3} more
                    </div>
                  )}
                </div>
              )}

            <label htmlFor="providerPortfolioLink">
              Portfolio link (optional)
              <input
                type="url"
                id="providerPortfolioLink"
                name="providerPortfolioLink"
                placeholder="https://yourwebsite.com or portfolio link"
                value={formData.providerPortfolioLink}
                onChange={handleChange}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => navigate("/provider/onboarding/page2")}
            className="back-button"
          >
            ← Back
          </button>

          <button type="submit" className="save-continue-button">
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
