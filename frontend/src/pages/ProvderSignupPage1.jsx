// Created by: Blake Ostler
// Edited by: Raphael Daveal

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext.jsx";
import { getProviderCapabilities, getProviderOnboardingDraft, saveProviderOnboardingDraft, searchProviderLocations } from "../api/provider";
import { uploadFile } from "../api/uploads";
import { useAuth } from "../context/AuthContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function ProviderIcon({ type }) {
  if (type === "Individual") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.6-3.6 2.8-5.4 6.5-5.4s5.9 1.8 6.5 5.4" /></svg>;
  if (type === "Business/Company") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V8h16v12M2.5 20h19M8 8V5h8v3M8 12h2M14 12h2M8 16h2M14 16h2" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="2.7" /><circle cx="17" cy="8.5" r="2.2" /><path d="M3.8 19.5c.5-3.2 2.3-5 5.2-5s4.7 1.8 5.2 5M14 15c2.7-.4 4.9 1 5.6 3.5" /></svg>;
}

export default function ProviderSignupPageOne() {
  const { formData, updateField, mergeFormData, setOnboardingFlow } = useForm();
  const { user } = useAuth();
  const userEditedStepOneRef = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    setOnboardingFlow("service");
    Promise.all([getProviderCapabilities(), getProviderOnboardingDraft()])
      .then(([capabilityResponse, draftResponse]) => {
        const state = capabilityResponse?.data?.service;
        const draft = draftResponse?.data;

        // Do not let a late draft response overwrite a selection the user
        // has already made while Step 1 is loading.
        if (draft?.formData && !userEditedStepOneRef.current) {
          mergeFormData(draft.formData);
        }

        if (state?.status === "active" && state?.verificationStatus === "verified" && state?.applicationSubmittedAt) {
          navigate("/provider/dashboard", { replace: true });
        } else if (state?.applicationSubmittedAt || state?.verificationStatus === "rejected") {
          navigate("/provider/application-status", { replace: true });
        }
      })
      .catch(() => {});
  }, [setOnboardingFlow, mergeFormData, navigate]);

  useEffect(() => {
    if (!user) return;

    if (!formData.providerFirstName && user.firstName) {
      updateField("providerFirstName", user.firstName);
    }
    if (!formData.providerLastName && user.lastName) {
      updateField("providerLastName", user.lastName);
    }
    if (!formData.providerEmail && user.email) {
      updateField("providerEmail", user.email);
    }
    if (!formData.providerPhoneNumber && user.phone) {
      updateField("providerPhoneNumber", user.phone);
    }
    if (!formData.providerProfileImage && user.avatar?.url) {
      updateField("providerProfileImage", user.avatar);
      setProfilePreview(user.avatar.url);
    }
    if (!formData.providerLocation && user.location) {
      const location = [user.location.city, user.location.state, user.location.country]
        .filter(Boolean)
        .join(", ");
      if (location) updateField("providerLocation", location);
    }
  }, [user, formData.providerFirstName, formData.providerLastName, formData.providerEmail, formData.providerPhoneNumber, formData.providerProfileImage, formData.providerLocation, updateField]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [locationQuery, setLocationQuery] = useState(formData.providerLocation || "");

  useEffect(() => {
    setLocationQuery(formData.providerLocation || "");
  }, [formData.providerLocation]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const image = formData.providerProfileImage;
    if (!image) {
      setProfilePreview(null);
      return;
    }
    if (typeof image === "string") {
      setProfilePreview(image);
      return;
    }
    if (image.url) {
      setProfilePreview(image.url);
      return;
    }
    if (typeof File !== "undefined" && image instanceof File) {
      const url = URL.createObjectURL(image);
      setProfilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setProfilePreview(null);
  }, [formData.providerProfileImage]);

  useEffect(() => {
    const query = locationQuery.trim();
    if (query.length < 2 || query === formData.providerLocation) {
      setLocationSuggestions([]);
      return undefined;
    }
    let active = true;
    const timer = setTimeout(async () => {
      setLocationLoading(true);
      try {
        const response = await searchProviderLocations(query);
        if (active) setLocationSuggestions(response?.data?.locations || []);
      } catch {
        if (active) setLocationSuggestions([]);
      } finally {
        if (active) setLocationLoading(false);
      }
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [locationQuery, formData.providerLocation]);

  const providerTypes = [
    { value: "Individual", title: "Individual", description: "I offer services on my own" },
    { value: "Business/Company", title: "Business / Company", description: "I represent a registered business" },
    { value: "Team/Agency", title: "Team / Agency", description: "We are a team of providers" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    userEditedStepOneRef.current = true;
    updateField(name, value);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { alert("Please upload a JPG, PNG, or WebP image."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("File is too large. Maximum size allowed is 5MB."); return; }
    try {
      const uploaded = await uploadFile(file, "matchet/profiles");
      if (!uploaded?.url) throw new Error("Cloudinary did not return an image URL.");
      updateField("providerProfileImage", uploaded);
      setProfilePreview(uploaded.url);
    } catch (error) { alert(error.message || "Unable to upload your profile photo."); }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    try {
      const response = await saveProviderOnboardingDraft(formData, 1);
      if (response?.data?.formData) mergeFormData(response.data.formData);
      navigate("/provider/onboarding/page2");
    } catch (error) {
      if (error.code === "ONBOARDING_STEP_INCOMPLETE" || error.missingFields?.length) highlightOnboardingFields(error.missingFields);
      alert(error.message || "Please complete the highlighted fields before continuing.");
    }
  };

  return (
    <div className="provider-signup-page-container provider-signup-page1">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page1">
          <img src={sideImage} alt="Grow your business with Matchet" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={1} />

        <div className="provider-signup-form-page1">
          <h2 className="provider-signup-step-header">Tell us about yourself</h2>
          <p className="provider-signup-form-step-header-caption">
            Let&apos;s start with the basics for your provider profile.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="provider-signup-form-field-group">
              <p className="provider-signup-form-field-group-name">Account information</p>
              <p className="provider-signup-form-field-group-name-caption">
                We&apos;ve pre-filled your account details. You can update them in your account settings if needed.
              </p>

              <label htmlFor="providerFirstName">
                First name
                <input type="text" id="providerFirstName" name="providerFirstName" placeholder="Enter your first name" value={formData.providerFirstName || ""} onChange={handleChange} required />
              </label>

              <label htmlFor="providerLastName">
                Last name
                <input type="text" id="providerLastName" name="providerLastName" placeholder="Enter your last name" value={formData.providerLastName || ""} onChange={handleChange} required />
              </label>

              <label htmlFor="providerEmail">
                Email address
                <input type="email" id="providerEmail" name="providerEmail" value={formData.providerEmail || ""} readOnly required />
              </label>

              <fieldset className="phone-fieldset">
                <legend>Phone number</legend>
                <div className="phone-input-container">
                  <select id="providerCountryCode" name="providerCountryCode" value={formData.providerCountryCode || ""} onChange={handleChange} required>
                    <option value="" disabled>Country</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input type="tel" id="providerPhoneNumber" name="providerPhoneNumber" placeholder="703 258 0065" value={formData.providerPhoneNumber || ""} onChange={handleChange} required />
                </div>
              </fieldset>
            </div>

            <div className="provider-signup-form-field-group">
              <p className="provider-signup-form-field-group-name">Provider information</p>
              <p className="provider-signup-form-field-group-name-caption">Provider type</p>

              <fieldset className="provider-signup-provider-types">
                {providerTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`provider-signup-provider-type ${formData.providerType === type.value ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="providerType"
                      value={type.value}
                      checked={formData.providerType === type.value}
                      onChange={handleChange}
                      required
                    />
                    <span className="provider-signup-provider-type-radio" aria-hidden="true" />
                    <span className="provider-signup-provider-type-icon">
                      <ProviderIcon type={type.value} />
                    </span>
                    <span className="provider-signup-provider-type-copy">
                      <strong>{type.title}</strong>
                      <small>{type.description}</small>
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="provider-signup-profile-location-row">
                <div>
                  <label className="provider-signup-form-field-label" htmlFor="providerProfileImage">Profile photo</label>
                  <div className="provider-signup-profile-upload">
                    <div className="provider-signup-profile-avatar">
                      {profilePreview ? <img src={profilePreview} alt="Selected profile" /> : <span>No image</span>}
                    </div>
                    <div>
                      <label className="provider-signup-change-photo" htmlFor="providerProfileImage">Change photo</label>
                      <input type="file" id="providerProfileImage" name="providerProfileImage" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} hidden />
                      <p className="provider-signup-upload-note">JPG, PNG or WebP. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <label htmlFor="providerLocation">Location</label>
                  <input
                    type="text"
                    id="providerLocation"
                    name="providerLocation"
                    value={locationQuery}
                    placeholder="Search city or area"
                    autoComplete="off"
                    onChange={(event) => {
                      const value = event.target.value;
                      userEditedStepOneRef.current = true;
                      setLocationQuery(value);
                      if (value !== formData.providerLocation) updateField("providerLocation", "");
                    }}
                    required
                  />
                  {(locationLoading || locationSuggestions.length > 0) && locationQuery !== formData.providerLocation && (
                    <div style={{ position: "absolute", zIndex: 20, top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: "1px solid #dfe4ef", borderRadius: 8, boxShadow: "0 8px 24px rgba(16,24,63,.12)", overflow: "hidden" }}>
                      {locationLoading && <div style={{ padding: "10px 12px", color: "#687099" }}>Searching locations...</div>}
                      {!locationLoading && locationSuggestions.map((location) => (
                        <button
                          key={location.label + location.coordinates.coordinates.join(",")}
                          type="button"
                          style={{ display: "block", width: "100%", border: 0, background: "#fff", padding: "10px 12px", textAlign: "left", cursor: "pointer" }}
                          onClick={() => {
                            userEditedStepOneRef.current = true;
                            setLocationQuery(location.label);
                            updateField("providerLocation", location.label);
                            updateField("providerLocationData", location);
                            setLocationSuggestions([]);
                          }}
                        >
                          {location.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="provider-signup-bio-field">
                <label htmlFor="providerBio">
                  Short bio
                  <textarea id="providerBio" name="providerBio" rows="4" maxLength="500" placeholder="Tell customers a bit about yourself, your background, and what you do." value={formData.providerBio || ""} onChange={handleChange} required />
                </label>
                <span className="provider-signup-character-count">{(formData.providerBio || "").length}/500</span>
              </div>
            </div>

            <div className="provider-signup-form-actions">
              <button type="button" className="provider-signup-back-button" onClick={() => navigate("/for-providers")}>←&nbsp;&nbsp;Back</button>
              <button type="submit" className="provider-signup-save-continue-button">Save &amp; continue&nbsp;&nbsp;→</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
