// Created by: Blake Ostler
// Edited by: Raphael Daveal

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { saveProviderOnboardingDraft } from "../api/provider";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function ServiceTypeIcon({ type }) {
  if (type === "In-person") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-6.1 6-11a6 6 0 1 0-12 0c0 4.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>;
  if (type === "Remote") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="13" height="12" rx="2" /><path d="m16.5 9 4-2.5v11l-4-2.5M7 21h7" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-3-3M17 17H7l3 3M17 7l3 3-3 3M7 17l-3-3 3-3" /></svg>;
}

export default function ProviderSignupPageTwo() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();
  const [areas, setAreas] = useState(
    formData.providerAreasServed ? [formData.providerAreasServed] : [""],
  );

  const categories = [
    { value: "home-services", label: "Home Services" },
    { value: "beauty", label: "Beauty & Wellness" },
    { value: "photography", label: "Photography" },
    { value: "events", label: "Events & Entertainment" },
    { value: "education", label: "Education & Training" },
    { value: "professional", label: "Professional Services" },
  ];

  const durations = ["1 hour or less", "1-2 hours", "2-3 hours", "3+ hours"];
  const peopleOptions = ["1", "2", "3", "4+"];
  const serviceTypes = [
    { value: "In-person", title: "In-person", description: "I travel to customers" },
    { value: "Remote", title: "Remote", description: "Delivered online" },
    { value: "Both", title: "Both", description: "In-person and remote" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateField(name, value);
  };

  const handleAreaChange = (index, value) => {
    setAreas((current) => {
      const next = [...current];
      next[index] = value;
      updateField("providerAreasServed", next.filter(Boolean));
      return next;
    });
  };

  const addArea = () => {
    setAreas((current) => [...current, ""]);
  };

  const handleServiceImages = (event) => {
    const files = Array.from(event.target.files || []);
    const valid = files.filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) alert("Only JPG, PNG, or WebP images up to 5MB each are allowed.");
    updateField("providerServiceImages", valid.slice(0, 6));
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    const nextFormData = { ...formData, providerAreasServed: areas.filter(Boolean) };
    try {
      await saveProviderOnboardingDraft(nextFormData);
      navigate("/provider/onboarding/page3");
    } catch (error) {
      alert(error.message || "Unable to save your progress. Please try again.");
    }
  };

  return (
    <div className="provider-signup-page-container provider-signup-page2">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page2">
          <img src={sideImage} alt="Share your services with the right people" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={2} />

        <div className="provider-signup-form-page2">
          <h2 className="provider-signup-step-header">Tell us about your services</h2>
          <p className="provider-signup-form-step-header-caption">
            Add the services you offer, set your pricing, and tell customers what to expect.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="provider-signup-form-field-group">
              <p className="provider-signup-form-field-group-name">Service details</p>
              <p className="provider-signup-form-step-header-caption">You can add more services later.</p>

              <label htmlFor="providerServiceCat">
                Service category *
                <select id="providerServiceCat" name="providerServiceCat" value={formData.providerServiceCat || ""} onChange={handleChange} required>
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </label>

              <label htmlFor="providerServiceName">
                Service name *
                <input type="text" id="providerServiceName" name="providerServiceName" placeholder="e.g. Home Cleaning, Makeup, Photography" value={formData.providerServiceName || ""} onChange={handleChange} required />
              </label>

              <label htmlFor="providerServiceImages">
                Service images
                <input id="providerServiceImages" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleServiceImages} />
                <small>Upload up to 6 JPG, PNG, or WebP images. Max 5MB each.</small>
              </label>

              <div className="provider-service-description-field">
                <label htmlFor="providerServiceDesc">
                  Service description *
                  <textarea id="providerServiceDesc" name="providerServiceDesc" rows="4" maxLength="500" placeholder="Describe your service, what's included, and what makes it unique." value={formData.providerServiceDesc || ""} onChange={handleChange} required />
                </label>
                <span className="provider-signup-service-character-count">{(formData.providerServiceDesc || "").length}/500</span>
              </div>

              <fieldset className="provider-service-type-fieldset">
                <legend>Service type *</legend>
                <div className="provider-service-type-options">
                  {serviceTypes.map((type) => (
                    <label key={type.value} className={`provider-service-type-option ${formData.providerServiceType === type.value ? "is-selected" : ""}`}>
                      <input type="radio" name="providerServiceType" value={type.value} checked={formData.providerServiceType === type.value} onChange={handleChange} required />
                      <span className="provider-service-type-icon"><ServiceTypeIcon type={type.value} /></span>
                      <span className="provider-service-type-copy"><strong>{type.title}</strong><small>{type.description}</small></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="provider-price-field" htmlFor="providerServicePrice">
                Starting price (NGN) *
                <span className="provider-price-input">
                  <span className="provider-price-prefix">₦</span>
                  <input type="number" id="providerServicePrice" name="providerServicePrice" min="0" step="1" placeholder="0" value={formData.providerServicePrice || ""} onChange={handleChange} required />
                </span>
              </label>

              <label htmlFor="providerServiceDuration">
                Service duration *
                <select id="providerServiceDuration" name="providerServiceDuration" value={formData.providerServiceDuration || ""} onChange={handleChange} required>
                  <option value="" disabled>Select duration</option>
                  {durations.map((duration) => <option key={duration} value={duration}>{duration}</option>)}
                </select>
              </label>

              <label htmlFor="providerServiceNumberOfPeople">
                Number of people (per session)
                <select id="providerServiceNumberOfPeople" name="providerServiceNumberOfPeople" value={formData.providerServiceNumberOfPeople || ""} onChange={handleChange}>
                  <option value="" disabled>Select</option>
                  {peopleOptions.map((people) => <option key={people} value={people}>{people}</option>)}
                </select>
              </label>

              <div className="provider-areas-served-field">
                <label htmlFor="providerAreasServed-0">
                  Areas served *
                  <select id="providerAreasServed-0" value={areas[0] || ""} onChange={(event) => handleAreaChange(0, event.target.value)} required>
                    <option value="" disabled>Search locations (e.g. Lagos, Ikeja, Victoria Island)</option>
                    <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                    <option value="Ikeja, Lagos">Ikeja, Lagos</option>
                    <option value="Victoria Island, Lagos">Victoria Island, Lagos</option>
                    <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                  </select>
                </label>
              </div>

              {areas.slice(1).map((area, index) => (
                <div className="provider-areas-served-field" key={index}>
                  <label htmlFor={`providerAreasServed-${index + 1}`}>
                    Additional area
                    <select id={`providerAreasServed-${index + 1}`} value={area} onChange={(event) => handleAreaChange(index + 1, event.target.value)}>
                      <option value="">Select another location</option>
                      <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                      <option value="Ikeja, Lagos">Ikeja, Lagos</option>
                      <option value="Victoria Island, Lagos">Victoria Island, Lagos</option>
                      <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                    </select>
                  </label>
                </div>
              ))}

              <button type="button" className="provider-add-another-location-button" onClick={addArea}>+ Add another location</button>
            </div>

            <div className="provider-signup-page2-actions">
              <button type="button" className="provider-signup-back-button" onClick={() => navigate("/provider/onboarding")}>←&nbsp;&nbsp;Back</button>
              <button type="button" className="provider-add-another-service-button" onClick={() => navigate("/provider/onboarding/page2")}>Save and add another service</button>
              <button type="submit" className="provider-signup-save-continue-button">Save &amp; continue&nbsp;&nbsp;→</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
