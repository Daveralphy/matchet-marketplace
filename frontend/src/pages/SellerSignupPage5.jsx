// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { highlightOnboardingFields, saveSellerOnboardingDraft } from "../api/provider";
import { useForm } from "../context/FormContext";
import { uploadFile } from "../api/uploads";
import { useEffect, useMemo } from "react";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageFive() {
  const { formData, updateField, mergeFormData } = useForm();
  const navigate = useNavigate();

  const filePreview = useMemo(() => {
    const createPreview = (value) => {
      if (!value) return null;
      if (typeof value === "string") return value;
      if (value.url) return value.url;
      if (typeof File !== "undefined" && value instanceof File) return URL.createObjectURL(value);
      return null;
    };
    return {
      front: createPreview(formData.idImageFront),
      back: createPreview(formData.idImageBack),
      selfie: createPreview(formData.selfieImage),
    };
  }, [formData.idImageFront, formData.idImageBack, formData.selfieImage]);

  useEffect(() => {
    return () => Object.values(filePreview).forEach((url) => url && URL.revokeObjectURL(url));
  }, [filePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const uploadIdentityFile = async (file, field, acceptedTypes) => {
    if(!file || !acceptedTypes.includes(file.type)){if(file) alert("Please upload a supported file type.");return;}
    if(file.size>5*1024*1024){alert("File is too large. Maximum size allowed is 5MB.");return;}
    try{
      const uploaded=await uploadFile(file,"matchet/verification");
      if(!uploaded?.url) throw new Error("Cloudinary did not return a file URL.");
      updateField(field,uploaded);
    }catch(error){alert(error.message||"Unable to upload this verification file.");}
  };
  const handleIdentityFile = (field,maxTypes)=>(e)=>{
    const file=e.target.files?.[0]; e.target.value=""; uploadIdentityFile(file,field,maxTypes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    try {
      const response = await saveSellerOnboardingDraft(formData, 3);
      if (response?.data?.formData) mergeFormData(response.data.formData);
      navigate("/register/page4");
    } catch (error) {
      const invalidFields = error.missingFields?.length ? error.missingFields : Object.keys(error.errors || {});
      if (invalidFields.length) {
        highlightOnboardingFields(invalidFields, error.errors);
        return;
      }
      const safeMessage = /validation failed|cast to embedded|objectexpectederror|casterror/i.test(error.message || "")
        ? "Please check the highlighted fields and try again."
        : error.message || "Unable to save your progress. Please try again.";
      alert(safeMessage);
    }
  };

  return (
    <>
      <div className="seller-signup-page-container seller-signup-page5 ob-seller-step ob-seller-form-step">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={3} />

          <h2 className="seller-signup-step-header">
            Verify your identity
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Help us keep Matchet safe and build trust with our community.
          </p>

          <form
            className="seller-signup-form-page5"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="seller-signup-form-field-group">
              <p className="seller-signup-form-field-group-name">
                Identity document
              </p>

              <p className="seller-signup-form-field-group-name-caption">
                Upload a valid government-issued ID
              </p>

              <label htmlFor="idType">
                ID Type *
                <select
                  id="idType"
                  name="idType"
                  value={formData.idType}
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

              <label htmlFor="idNumber">
                ID number *
                <input
                  type="password"
                  id="idNumber"
                  name="idNumber"
                  placeholder="Enter your ID number"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="seller-signup-identity-upload-grid">
                <label className="seller-signup-upload">
                  {!formData.idImageFront ? (
                    <>
                      <span className="seller-signup-upload-icon">↑</span>
                      <strong>Upload front of ID</strong>
                      <span>JPG, PNG or PDF. Max 5MB.</span>
                    </>
                  ) : (
                    <div className="seller-signup-file-preview">
                      {formData.idImageFront.type === "application/pdf" ? (
                        <div className="seller-signup-pdf-preview">
                          <span>PDF</span>
                          <small>{formData.idImageFront.name || "ID front document"}</small>
                        </div>
                      ) : (
                        <img src={filePreview.front} alt="ID front preview" />
                      )}
                      <span className="seller-signup-file-selected">ID front selected</span>
                    </div>
                  )}

                  <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={handleIdentityFile("idImageFront", ["image/png", "image/jpeg", "application/pdf"])} />
                </label>

                <label className="seller-signup-upload">
                  {!formData.idImageBack ? (
                    <>
                      <span className="seller-signup-upload-icon">↑</span>
                      <strong>Upload back of ID</strong>
                      <span>JPG, PNG or PDF. Max 5MB.</span>
                    </>
                  ) : (
                    <div className="seller-signup-file-preview">
                      {formData.idImageBack.type === "application/pdf" ? (
                        <div className="seller-signup-pdf-preview">
                          <span>PDF</span>
                          <small>{formData.idImageBack.name || "ID back document"}</small>
                        </div>
                      ) : (
                        <img src={filePreview.back} alt="ID back preview" />
                      )}
                      <span className="seller-signup-file-selected">ID back selected</span>
                    </div>
                  )}

                  <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={handleIdentityFile("idImageBack", ["image/png", "image/jpeg", "application/pdf"])} />
                </label>

                <div className="seller-signup-tips">
                  <h4>Tips for a successful verification</h4>

                  <ul>
                    <li>Use a valid, government-issued ID.</li>
                    <li>
                      Make sure the photos are clear and well-lit.
                    </li>
                    <li>
                      All information should be visible and readable.
                    </li>
                    <li>Do not edit or crop the document.</li>
                    <li>
                      The name on your ID should match your account details.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="seller-signup-form-field-group">
              <p className="seller-signup-form-field-group-name">
                Selfie verification
              </p>

              <p className="seller-signup-form-field-group-name-caption">
                Take a clear selfie so we can match it with your ID
              </p>

              <div className="seller-signup-selfie-grid">
                <label className="seller-signup-upload">
                  <span className="seller-signup-upload-icon">↑</span>

                  {!formData.selfieImage ? (
                    <>
                      <span className="seller-signup-upload-icon">↑</span>
                      <strong>Upload a selfie</strong>
                      <span>JPG or PNG. Max 5MB.</span>
                    </>
                  ) : (
                    <div className="seller-signup-file-preview">
                      <img src={filePreview.selfie} alt="Selfie preview" className="seller-signup-selfie-preview" />
                      <span className="seller-signup-file-selected">Selfie selected</span>
                    </div>
                  )}

                  <input type="file" accept="image/png,image/jpeg" onChange={handleIdentityFile("selfieImage", ["image/png", "image/jpeg"])} />
                </label>

                <div className="seller-signup-tips">
                  <h4>Tips for a good selfie</h4>

                  <ul>
                    <li>Be in a well-lit area.</li>
                    <li>Make sure your face is clearly visible.</li>
                    <li>
                      Do not wear sunglasses or a face covering.
                    </li>
                    <li>Look directly at the camera.</li>
                    <li>Use a neutral background.</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="importantText">
              Your information is secure. We use industry-standard encryption
              to keep your data safe and only for verification purposes.
            </p>

            <button
              type="button"
              onClick={() => navigate("/register/page3")}
              className="back-button"
            >
              ← Back
            </button>

            <button
              className="save-continue-button"
              type="submit"
            >
              Save &amp; continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}