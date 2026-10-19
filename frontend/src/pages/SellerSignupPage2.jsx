// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { highlightOnboardingFields, saveSellerOnboardingDraft } from "../api/provider";
import { useForm } from "../context/FormContext";
import { uploadFile } from "../api/uploads";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageTwo() {
  const { formData, updateField, mergeFormData } = useForm();
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const image = formData.businessLogo;
    if (!image) {
      setLogoPreview(null);
      return;
    }
    if (typeof image === "string") {
      setLogoPreview(image);
      return;
    }
    if (image.url) {
      setLogoPreview(image.url);
      return;
    }
    if (typeof File !== "undefined" && image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      reader.readAsDataURL(image);
      return () => {
        reader.onload = null;
      };
    }
    setLogoPreview(null);
  }, [formData.businessLogo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleFileChange = async (e) => {
    const file=e.target.files?.[0]; e.target.value="";
    if(!file) return;
    if(!["image/png","image/jpeg","image/webp"].includes(file.type)){alert("Please upload a PNG, JPG, or WebP image.");return;}
    if(file.size>5*1024*1024){alert("File is too large. Maximum size allowed is 5MB.");return;}
    try{
      const uploaded=await uploadFile(file,"matchet/stores");
      if(!uploaded?.url) throw new Error("Cloudinary did not return an image URL.");
      updateField("businessLogo",uploaded); setLogoPreview(uploaded.url);
    }catch(error){alert(error.message||"Unable to upload your business logo.");}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    try {
      const response = await saveSellerOnboardingDraft(formData, 2);
      if (response?.data?.formData) mergeFormData(response.data.formData);
      navigate("/register/page3");
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
      <div className="seller-signup-page-container seller-signup-page2 ob-seller-step ob-seller-form-step">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={2} />

          <h2 className="seller-signup-step-header">
            Business information
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Tell us about your business so customers can trust your store.
          </p>

          <form
            className="seller-signup-form-page2"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="seller-signup-form-field-group">
              <label htmlFor="businessName">
                Business name *
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="e.g. HomeCrafts NG"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="businessReg">
                Business registration (optional)
                <input
                  type="text"
                  id="businessReg"
                  name="businessReg"
                  placeholder="e.g. CAC number"
                  value={formData.businessReg}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="businessCat">
                Business category *
                <select
                  id="businessCat"
                  name="businessCat"
                  value={formData.businessCat}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="food">Food</option>
                  <option value="home-living">Home &amp; Living</option>
                  <option value="electronics">Electronics</option>
                </select>
              </label>

              <label htmlFor="businessDesc">
                Business description *
                <textarea
                  id="businessDesc"
                  name="businessDesc"
                  rows="4"
                  maxLength="500"
                  placeholder="Tell us about your business, what you sell, and what makes it unique (max 500 characters)."
                  value={formData.businessDesc}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="businessAddress">
                Business address *
                <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    placeholder="Enter your full business address"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    required
                  />
              </label>

              <fieldset className="business-phone-fieldset">
                <legend>Business phone number *</legend>

                <div className="phone-input-container">
                  <select
                    id="businessPhoneCountryCode"
                    name="businessPhoneCountryCode"
                    value={formData.businessPhoneCountryCode}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select country code
                    </option>
                    <option value="+1">US +1</option>
                    <option value="+44">UK +44</option>
                    <option value="+234">NG +234</option>
                  </select>

                  <input
                    type="tel"
                    id="businessPhoneNumber"
                    name="businessPhoneNumber"
                    placeholder="555 555 5555"
                    value={formData.businessPhoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </fieldset>

              <label className="seller-signup-upload seller-signup-business-logo">
                {logoPreview ? <img src={logoPreview} alt="Business logo preview" className="seller-signup-logo-preview" /> : <span className="seller-signup-upload-icon">↑</span>}

                <strong>{logoPreview ? "Logo selected" : "Upload your logo"}</strong>

                <span>JPG, PNG or WebP. Max 5MB.</span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />
              </label>

              <div className="seller-signup-tips">
                <h4>Tips for a great profile</h4>

                <ul>
                  <li>Use a clear and recognizable business name.</li>
                  <li>Choose the right category.</li>
                  <li>Write a short and compelling description.</li>
                  <li>Add a logo to build trust.</li>
                  <li>Make sure your contact information is accurate.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="back-button"
            >
              ← Back
            </button>

            <button
              type="submit"
              className="save-continue-button"
            >
              Save &amp; continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}