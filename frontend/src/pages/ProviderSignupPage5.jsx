// Created by:  Blake Ostler
// Edited by:  Blake Ostler

//TODO:  Need "tips for successful verification" image from Raphael
//TODO:  Need "tips for a good selfie" image from Raphael
//TODO:  Styling

// Got help from Google Gemini on the file upload fields. I typed the code myself.

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";

export default function ProviderSignupPageFive() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  // A generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const MAX_SIZE_MB = 5;
  const MAX_FILE_SIZE = MAX_SIZE_MB * 1024 * 1024;
  const MAX_FILE_SIZE_ALERT = `File is too large. Maximum size allowed is ${MAX_SIZE_MB}MB.`;

  const handleFrontIdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(MAX_FILE_SIZE_ALERT);
      e.target.value = "";
      return;
    }
    updateField("providerIdImageFront", file);
    e.target.value = "";
  };

  const handleFrontIdDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(MAX_FILE_SIZE_ALERT);
      return;
    }
    updateField("providerIdImageFront", file);
  };

  const handleRemoveFrontId = () => {
    updateField("providerIdImageFront", null);
  };

  const handleBackIdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(MAX_FILE_SIZE_ALERT);
      e.target.value = "";
      return;
    }
    updateField("providerIdImageBack", file);
    e.target.value = "";
  };

  const handleBackIdDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(MAX_FILE_SIZE_ALERT);
      return;
    }
    updateField("providerIdImageBack", file);
  };

  const handleRemoveBackId = () => {
    updateField("providerIdImageBack", null);
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(MAX_FILE_SIZE_ALERT);
      e.target.value = "";
      return;
    }
    updateField("providerSelfieImage", file);
    e.target.value = "";
  };

  const handleSelfieDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(MAX_FILE_SIZE_ALERT);
      return;
    }
    updateField("providerSelfieImage", file);
  };

  const handleRemoveSelfie = () => {
    updateField("providerSelfieImage", null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  //Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    navigate("/provider/onboarding/page6");
  };

  return (
    <div className="provider-signup-page-container provider-signup-page5">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page5">
          <img src={sideImage} alt="Provider sign-up decoration" />
        </div>
      </section>
      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={5} />
        <h2 className="provider-signup-step-header">Verify your identity</h2>
        <p className="provider-signup-form-step-header-caption">
          Help us confirm your identity so we can help keep Matchet safe and
          trustworthy.
        </p>
        <form className="provider-signup-form-page5" onSubmit={handleSubmit}>
          <div className="provider-signup-form-field-group">
            <div className="provider-signup-form-id-left-side">
              <p className="provider-signup-form-field-group-name">
                Identity document
              </p>
              <p className="provider-signup-form-field-group-name-caption">
                Upload a valid government-issued ID
              </p>

              <label htmlFor="providerIdType">
                ID Type *
                <select
                  id="providerIdType"
                  name="providerIdType"
                  value={formData.providerIdType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select ID type
                  </option>
                  <option value="Driver License">Driver License</option>
                  <option value="National ID Card">National ID Card</option>
                  <option value="Passport">Passport</option>
                </select>
              </label>

              <label htmlFor="providerIdNumber">
                ID number *
                <input
                  type="password"
                  id="providerIdNumber"
                  name="providerIdNumber"
                  placeholder="Enter your ID number"
                  value={formData.providerIdNumber}
                  onChange={handleChange}
                  required
                />
              </label>

              <p>Upload clear photos of your ID *</p>

              {/* FRONT OF ID */}
              <div style={{ marginBottom: "25px" }}>
                <label
                  htmlFor="providerIdImageFront"
                  onDragOver={handleDragOver}
                  onDrop={handleFrontIdDrop}
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "140px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#fafafa",
                    position: "relative",
                  }}
                >
                  {!formData.providerIdImageFront ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#333",
                          marginBottom: "4px",
                        }}
                      >
                        Upload front of ID
                      </span>

                      <span style={{ color: "#665", fontSize: "13px" }}>
                        JPG, PNG or PDF. Max 5MB.
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {formData.providerIdImageFront.type ===
                      "application/pdf" ? (
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "28px" }}>📄</span>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#333",
                              margin: "4px 0 0 0",
                              wordBreak: "break-all",
                            }}
                          >
                            {formData.providerIdImageFront.name}
                          </p>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(
                            formData.providerIdImageFront,
                          )}
                          alt="Front ID preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "110px",
                            objectFit: "contain",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveFrontId}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "#ff4d4d",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
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
                  )}
                  <input
                    type="file"
                    id="providerIdImageFront"
                    name="providerIdImageFront"
                    accept="image/jpeg, image/jpg, image/png, application/pdf"
                    onChange={handleFrontIdChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              {/* BACK OF ID */}
              <div>
                <label
                  htmlFor="providerIdImageBack"
                  onDragOver={handleDragOver}
                  onDrop={handleBackIdDrop}
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "140px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#fafafa",
                    position: "relative",
                  }}
                >
                  {!formData.providerIdImageBack ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#333",
                          marginBottom: "4px",
                        }}
                      >
                        Upload back of ID
                      </span>

                      <span style={{ color: "#665", fontSize: "13px" }}>
                        JPG, PNG or PDF. Max 5MB.
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {formData.providerIdImageBack.type ===
                      "application/pdf" ? (
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "28px" }}>📄</span>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#333",
                              margin: "4px 0 0 0",
                              wordBreak: "break-all",
                            }}
                          >
                            {formData.providerIdImageBack.name}
                          </p>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(
                            formData.providerIdImageBack,
                          )}
                          alt="Back ID preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "110px",
                            objectFit: "contain",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveBackId}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "#ff4d4d",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
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
                  )}
                  <input
                    type="file"
                    id="providerIdImageBack"
                    name="providerIdImageBack"
                    accept="image/jpeg, image/jpg, image/png, application/pdf"
                    onChange={handleBackIdChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div className="provider-signup-form-id-right-side">
                <p>???Insert tips for successful verification image???</p>
              </div>
            </div>
          </div>

          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">
              Selfie verification
            </p>
            <p className="provider-signup-form-field-group-name-caption">
              Take a clear selfie so we can match it with your ID
            </p>
            {/* SELFIE */}
            <div className="provider-signup-form-selfie-image-container">
              <div
                className="provider-signup-form-selfie-left-side"
                style={{ marginBottom: "25px" }}
              >
                <label
                  htmlFor="providerSelfieImage"
                  onDragOver={handleDragOver}
                  onDrop={handleSelfieDrop}
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "140px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#fafafa",
                    position: "relative",
                  }}
                >
                  {!formData.providerSelfieImage ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#333",
                          marginBottom: "4px",
                        }}
                      >
                        Upload a selfie
                      </span>
                      <span style={{ color: "#665", fontSize: "13px" }}>
                        JPG or PNG. Max 5MB.
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(formData.providerSelfieImage)}
                        alt="Selfie preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "110px",
                          objectFit: "contain",
                          borderRadius: "4px",
                        }}
                      />

                      <button
                        type="button"
                        onClick={handleRemoveSelfie}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "#ff4d4d",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
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
                  )}
                  <input
                    type="file"
                    id="providerSelfieImage"
                    name="providerSelfieImage"
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={handleSelfieChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div className="provider-signup-form-selfie-right-side">
                ???Insert tips for a good selfie image???
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/provider/onboarding/page4")}
            className="back-button"
          >
            ← Back
          </button>
          <button className="save-continue-button" type="submit">
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
