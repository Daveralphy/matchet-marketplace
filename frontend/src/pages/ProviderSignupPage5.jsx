import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { highlightOnboardingFields, saveProviderOnboardingDraft } from "../api/provider";
import { uploadFile } from "../api/uploads";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function UploadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M8 8l4-4 4 4M5 15v4h14v-4" /></svg>;
}

function CheckIcon() {
  return <span className="provider-verification-check">✓</span>;
}

function SelfieIllustration() {
  return (
    <svg className="provider-selfie-illustration" viewBox="0 0 150 110" aria-hidden="true">
      <circle cx="63" cy="36" r="18" />
      <path d="M36 96c3-22 13-34 27-34s24 12 27 34M90 58l20-13v43H90M99 55l12-9" />
      <rect x="94" y="41" width="28" height="50" rx="5" />
      <circle cx="108" cy="84" r="2" />
    </svg>
  );
}

export default function ProviderSignupPageFive() {
  const { formData, updateField, mergeFormData } = useForm();
  const navigate = useNavigate();

  const maxFileSize = 5 * 1024 * 1024;

  const uploadVerificationFile = async (file, field, acceptedTypes) => {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) { alert("Please upload a supported file type."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("File is too large. Maximum size allowed is 5MB."); return; }
    try {
      const uploaded = await uploadFile(file, "matchet/verification");
      if (!uploaded?.url) throw new Error("Cloudinary did not return a file URL.");
      updateField(field, uploaded);
    } catch (error) { alert(error.message || "Unable to upload this verification file."); }
  };
  const validateAndStoreFile = (event, field, acceptedTypes) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    uploadVerificationFile(file, field, acceptedTypes);
  };
  const handleDrop = (event, field, acceptedTypes) => {
    event.preventDefault();
    uploadVerificationFile(event.dataTransfer.files?.[0], field, acceptedTypes);
  };

  const filePreview = useMemo(() => {
    const createPreview = (value) => {
      if (!value) return null;
      if (typeof value === "string") return { url: value, type: "" };
      if (value && typeof value === "object" && value.url) return { url: value.url, type: value.mimeType || value.type || "" };
      if (typeof File !== "undefined" && value instanceof File) return { url: URL.createObjectURL(value), type: value.type || "" };
      return null;
    };
    return {
      front: createPreview(formData.providerIdImageFront),
      back: createPreview(formData.providerIdImageBack),
      selfie: createPreview(formData.providerSelfieImage),
    };
  }, [formData.providerIdImageFront, formData.providerIdImageBack, formData.providerSelfieImage]);

  useEffect(() => {
    return () => Object.values(filePreview).forEach((item) => item?.url && item.url.startsWith("blob:") && URL.revokeObjectURL(item.url));
  }, [filePreview]);

  const renderUploadBox = ({ field, inputId, title, accept, types, preview, file }) => (
    <label
      className="provider-verification-upload-box"
      htmlFor={inputId}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => handleDrop(event, field, types)}
    >
      {!file ? (
        <>
          <UploadIcon />
          <strong>{title}</strong>
          <span>JPG, PNG or PDF. Max 5MB.</span>
        </>
      ) : (
        <div className="provider-verification-file-preview">
          {file.type === "application/pdf" ? (
            <div className="provider-verification-pdf-preview">
              <span>PDF</span>
              <small>{file.name}</small>
            </div>
          ) : (
            <img src={preview} alt={title} />
          )}
          <button
            type="button"
            className="provider-verification-remove"
            onClick={(event) => {
              event.preventDefault();
              updateField(field, null);
            }}
            aria-label={`Remove ${title}`}
          >
            ×
          </button>
        </div>
      )}
      <input
        id={inputId}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => validateAndStoreFile(event, field, types)}
      />
    </label>
  );

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

  const tips = [
    "Use a valid, government-issued ID (National ID, Driver's License, or International Passport).",
    "Make sure the photo is clear and well-lit.",
    "All information should be visible and readable.",
    "Do not edit or crop out any part of the document.",
    "The name on your ID should match your account details.",
  ];

  const selfieTips = [
    "Be in a well-lit area.",
    "Make sure your face is clearly visible.",
    "Do not wear sunglasses or a face covering.",
    "Look directly at the camera.",
  ];

  return (
    <div className="provider-signup-page-container provider-signup-page5">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page5">
          <img src={sideImage} alt="A safer marketplace for everyone" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={3} />

        <div className="provider-signup-form-page5">
          <h2 className="provider-signup-step-header">Verify your identity</h2>
          <p className="provider-signup-form-step-header-caption">
            Help us confirm your identity so we can keep Matchet safe and trustworthy.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <section className="provider-verification-card">
              <div className="provider-verification-document">
                <h3>Identity document</h3>
                <p>Upload a valid government-issued ID.</p>

                <div className="provider-verification-fields">
                  <label htmlFor="providerIdType">
                    Select ID type *
                    <select id="providerIdType" name="providerIdType" value={formData.providerIdType || ""} onChange={(event) => updateField("providerIdType", event.target.value)} required>
                      <option value="" disabled>Select ID type</option>
                      <option value="National ID Card">National ID Card</option>
                      <option value="Driver License">Driver's License</option>
                      <option value="Passport">International Passport</option>
                    </select>
                  </label>

                  <label htmlFor="providerIdNumber">
                    ID number *
                    <input id="providerIdNumber" name="providerIdNumber" type="text" placeholder="Enter your ID number" value={formData.providerIdNumber || ""} onChange={(event) => updateField("providerIdNumber", event.target.value)} required />
                  </label>
                </div>

                <p className="provider-verification-upload-label">Upload clear photos of your ID *</p>
                <div className="provider-verification-upload-grid">
                  {renderUploadBox({
                    field: "providerIdImageFront",
                    inputId: "providerIdImageFront",
                    title: "Upload front of ID",
                    accept: "image/jpeg,image/png,application/pdf",
                    types: ["image/jpeg", "image/png", "application/pdf"],
                    preview: filePreview.front,
                    file: formData.providerIdImageFront,
                  })}
                  {renderUploadBox({
                    field: "providerIdImageBack",
                    inputId: "providerIdImageBack",
                    title: "Upload back of ID",
                    accept: "image/jpeg,image/png,application/pdf",
                    types: ["image/jpeg", "image/png", "application/pdf"],
                    preview: filePreview.back,
                    file: formData.providerIdImageBack,
                  })}
                </div>
              </div>

              <aside className="provider-verification-tips">
                <h3>Tips for a successful verification</h3>
                <ul>
                  {tips.map((tip) => <li key={tip}><CheckIcon /><span>{tip}</span></li>)}
                </ul>
              </aside>
            </section>

            <section className="provider-selfie-card">
              <div>
                <h3>Selfie verification</h3>
                <p>Take a clear selfie so we can match it with your ID.</p>
              </div>

              <div className="provider-selfie-content">
                {renderUploadBox({
                  field: "providerSelfieImage",
                  inputId: "providerSelfieImage",
                  title: "Upload a selfie",
                  accept: "image/jpeg,image/png",
                  types: ["image/jpeg", "image/png"],
                  preview: filePreview.selfie,
                  file: formData.providerSelfieImage,
                })}

                <aside className="provider-selfie-tips">
                  <SelfieIllustration />
                  <div>
                    <h3>Tips for a good selfie</h3>
                    <ul>
                      {selfieTips.map((tip) => <li key={tip}><CheckIcon /><span>{tip}</span></li>)}
                    </ul>
                  </div>
                </aside>
              </div>
            </section>

            <div className="provider-signup-page5-actions">
              <button type="button" className="provider-signup-back-button" onClick={() => navigate("/provider/onboarding/page4")}>←&nbsp;&nbsp;Back</button>
              <button type="submit" className="provider-signup-save-continue-button">Save &amp; continue&nbsp;&nbsp;→</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
