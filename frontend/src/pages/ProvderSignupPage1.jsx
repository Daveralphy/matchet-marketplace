// Created by: Blake Ostler
// Edited by: Raphael Daveal

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react-router-dom";
import { useForm } from "../context/FormContext.jsx";
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
  const { formData, updateField, setOnboardingFlow } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { setOnboardingFlow("service"); }, [setOnboardingFlow]);

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

  const providerTypes = [
    { value: "Individual", title: "Individual", description: "I offer services on my own" },
    { value: "Business/Company", title: "Business / Company", description: "I represent a registered business" },
    { value: "Team/Agency", title: "Team / Agency", description: "We are a team of providers" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateField(name, value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size allowed is 5MB.");
      event.target.value = "";
      return;
    }
    updateField("providerProfileImage", file);
    setProfilePreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    navigate("/provider/onboarding/page2");
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
                  <label key={type.value} className={`provider-signup-provider-type ${formData.providerType === type.value ? "is-selected" : ""}`}>
                    <input type="radio" name="providerType" value={type.value} checked={formData.providerType === type.value} onChange={handleChange} required />
                    <ProviderIcon type={type.value} />
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

                <label htmlFor="providerLocation">
                  Location
                  <select id="providerLocation" name="providerLocation" value={formData.providerLocation || ""} onChange={handleChange} required>
                    <option value="" disabled>Select location</option>
                    <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                    <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                  </select>
                </label>
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
