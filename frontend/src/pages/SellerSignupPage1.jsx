// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "../context/FormContext.jsx";
import { useAuth } from "../context/AuthContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";
import { getProviderCapabilities, getSellerOnboardingDraft, saveSellerOnboardingDraft, highlightOnboardingFields } from "../api/provider";
import { uploadFile } from "../api/uploads";
import LocationSearch from "../components/LocationSearch";

export default function SellerSignupPageOne() {
  const { formData, updateField, mergeFormData, setOnboardingFlow, clearForm } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoSelectionRef = useRef(false);
  const userEditedSellerStepOneRef = useRef(false);

  useEffect(() => {
    setOnboardingFlow("seller");
    if (!user?.id) return;

    if (!formData.onboardingUserId || formData.onboardingUserId !== user.id) {
      clearForm();
      updateField("onboardingUserId", user.id);
      updateField("firstName", user.firstName || "");
      updateField("lastName", user.lastName || "");
      updateField("email", user.email || "");
      const phone = String(user.phone || "").trim();
      const code = phone.startsWith("+234") ? "+234" : phone.startsWith("+44") ? "+44" : phone.startsWith("+1") ? "+1" : "";
      updateField("countryCode", code);
      updateField("phoneNumber", code ? phone.slice(code.length).trim() : phone);
      if (user.location?.city && !formData.location) {
        const locationData = {
          city: user.location.city || "",
          state: user.location.state || "",
          country: user.location.country || "",
        };
        const label = [locationData.city, locationData.state, locationData.country].filter(Boolean).join(", ");
        if (label) {
          updateField("location", label);
          updateField("locationData", { ...locationData, label });
        }
      }
      if (user.avatar?.url) updateField("profileImage", user.avatar);
    }

    getSellerOnboardingDraft().then((response) => {
      const draft = response?.data;
      if (draft?.formData && !userEditedSellerStepOneRef.current) mergeFormData(draft.formData);
      if (draft?.onboardingStatus === "submitted") {
        navigate("/seller/dashboard", { replace: true });
      }
    }).catch(() => {});

    getProviderCapabilities().catch(() => {});
  }, [setOnboardingFlow, navigate, user?.id]);

  useEffect(() => {
    if (photoSelectionRef.current) return;
    const image = formData.profileImage;
    if (!image) { setPhotoPreview(null); return; }
    if (typeof image === "string") { setPhotoPreview(image); return; }
    if (image.url) { setPhotoPreview(image.url); return; }
    if (typeof File !== "undefined" && image instanceof File) {
      const url = URL.createObjectURL(image);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPhotoPreview(null);
  }, [formData.profileImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    userEditedSellerStepOneRef.current = true;
    updateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const locationInput = e.currentTarget.elements.location;
    if (formData.location && !formData.locationData) {
      locationInput?.setCustomValidity("Please select a location from the suggestions.");
    }
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      locationInput?.setCustomValidity("");
      return;
    }
    locationInput?.setCustomValidity("");

    try {
      const response = await saveSellerOnboardingDraft(formData, 1);
      if (response?.data?.formData) mergeFormData(response.data.formData);
      navigate("/register/page2");
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
      <div className="seller-signup-page-container seller-signup-page1 ob-seller-step ob-seller-form-step">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={1} />

          <h2 className="seller-signup-step-header">
            Tell us about yourself
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Let&apos;s start with the basics for your seller profile.
          </p>

          <form
            className="seller-signup-form-page1"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="seller-signup-form-field-group">
              <p className="seller-signup-form-field-group-name">
                Account information
              </p>

              <label htmlFor="firstName">
                First name
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="lastName">
                Last name
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="email">
                Email address
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <fieldset className="phone-fieldset">
                <legend>Phone number</legend>

                <div className="phone-input-container">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
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
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="555 555 5555"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </fieldset>
            </div>

            <div className="seller-signup-form-field-group">
              <p className="seller-signup-form-field-group-name">
                Seller information
              </p>

              <p className="seller-signup-form-field-group-name-caption">
                Tell us how you&apos;ll be selling on Matchet
              </p>

              <fieldset>
                <legend className="sr-only">Seller type</legend>

                <label>
                  <input
                    type="radio"
                    name="sellerType"
                    value="individual"
                    checked={formData.sellerType === "individual"}
                    onChange={handleChange}
                    required
                  />
                  Individual seller
                </label>

                <label>
                  <input
                    type="radio"
                    name="sellerType"
                    value="business"
                    checked={formData.sellerType === "business"}
                    onChange={handleChange}
                    required
                  />
                  Business/Company
                </label>
              </fieldset>

              <div className="seller-signup-profile-upload-wrap">
                <span className="seller-signup-form-field-label">
                  Profile photo
                </span>

                                <label className={`seller-signup-avatar-upload seller-signup-avatar-upload-modern ${photoPreview ? "has-image" : ""}`}>
                  {photoPreview ? <img className="seller-signup-avatar-image" src={photoPreview} alt="Seller profile preview" /> : <><span className="seller-signup-avatar-placeholder">◎</span><strong>Upload image</strong></>}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        alert("Image must be 5MB or smaller.");
                        return;
                      }
                      userEditedSellerStepOneRef.current = true;
                      updateField("profileImage", file);
                    }}
                    hidden
                  />
                </label>
                {photoPreview && <button type="button" className="seller-signup-remove-photo" onClick={() => { userEditedSellerStepOneRef.current = true; updateField("profileImage", null); }}>Remove</button>}

                <span className="seller-signup-upload-note">
                  JPG, PNG or WebP. Max 5MB.
                </span>
              </div>

              <label htmlFor="location">Location *</label>
              <LocationSearch
                name="location"
                id="location"
                value={formData.location}
                onChange={(value) => {
                  userEditedSellerStepOneRef.current = true;
                  updateField("location", value);
                  updateField("locationData", null);
                }}
                onSelect={(location) => {
                  userEditedSellerStepOneRef.current = true;
                  updateField("location", location.label);
                  updateField("locationData", location);
                }}
                placeholder="Search for your city, state, or country..."
                className="seller-location-search"
                required
              />

              <label htmlFor="sellerBio">
                Short bio (optional)

                <textarea
                  id="sellerBio"
                  name="sellerBio"
                  rows="4"
                  maxLength="500"
                  placeholder="Tell customers a bit about yourself and your products (max 500 characters)."
                  value={formData.sellerBio}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button type="submit" className="save-continue-button">
              Save &amp; continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
