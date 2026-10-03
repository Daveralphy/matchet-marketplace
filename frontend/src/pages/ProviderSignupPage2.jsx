// Created by: Blake Ostler
// Edited by: Raphael Daveal

import { useEffect, useState } from "react";
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

function getScalarSelectValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0] ?? "") : "";
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return String(value.value ?? value.label ?? value.name ?? "");
  }

  return String(value);
}

export default function ProviderSignupPageTwo() {
  const { formData, updateField, mergeFormData } = useForm();
  const navigate = useNavigate();
  const [areas, setAreas] = useState(() => {
    const value = formData.providerAreasServed;
    if (Array.isArray(value)) return value.length ? value.map((item) => getScalarSelectValue(item)) : [""];
    return value ? [getScalarSelectValue(value)] : [""];
  });
  const [servicePreviews, setServicePreviews] = useState(() => Array(6).fill(null));

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
    const next = areas.map((item) => getScalarSelectValue(item));
    next[index] = getScalarSelectValue(value);
    setAreas(next);
    updateField("providerAreasServed", next.filter(Boolean));
  };

  const addArea = () => {
    setAreas((current) => [...current, ""]);
  };

  useEffect(() => {
    const images = Array.isArray(formData.providerServiceImages) ? formData.providerServiceImages : [];
    setServicePreviews((previous) => {
      const next = Array(6).fill(null);
      images.slice(0, 6).forEach((image, index) => {
        next[index] = image?.url || (typeof image === "string" ? image : previous[index] || null);
      });
      return next;
    });
  }, [formData.providerServiceImages]);

  const handleServiceImage = (index, file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size allowed is 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setServicePreviews((previous) => {
      const next = [...previous];
      if (next[index]?.startsWith("blob:")) URL.revokeObjectURL(next[index]);
      next[index] = previewUrl;
      return next;
    });

    const images = Array.isArray(formData.providerServiceImages)
      ? [...formData.providerServiceImages]
      : [];
    images[index] = file;
    updateField("providerServiceImages", images.slice(0, 6));
  };

  const removeServiceImage = (index) => {
    setServicePreviews((previous) => {
      const next = [...previous];
      if (next[index]?.startsWith("blob:")) URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      next.push(null);
      return next;
    });

    const images = Array.isArray(formData.providerServiceImages)
      ? [...formData.providerServiceImages]
      : [];
    images.splice(index, 1);
    updateField("providerServiceImages", images);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    const nextFormData = { ...formData, providerAreasServed: areas.filter(Boolean) };
    try {
      const response = await saveProviderOnboardingDraft(nextFormData);
      if (response?.data?.formData) mergeFormData(response.data.formData);
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
                <select id="providerServiceCat" name="providerServiceCat" value={getScalarSelectValue(formData.providerServiceCat)} onChange={handleChange} required>
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </label>

              <label htmlFor="providerServiceName">
                Service name *
                <input type="text" id="providerServiceName" name="providerServiceName" placeholder="e.g. Home Cleaning, Makeup, Photography" value={formData.providerServiceName || ""} onChange={handleChange} required />
              </label>

              <div>
                <span className="provider-signup-form-field-label">Service images</span>
                <small>Upload up to 6 JPG, PNG, or WebP images. Max 5MB each.</small>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 9, marginTop: 8 }}>
                  {Array.from({ length: 6 }).map((_, index) => {
                    const image = formData.providerServiceImages?.[index];
                    const preview = servicePreviews[index];
                    return (
                      <label key={`service-image-slot-${index}`} style={{
                        position: "relative", minHeight: 120, boxSizing: "border-box", padding: 10,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        gap: 6, border: `1px ${image && preview ? "solid" : "dashed"} #cfd7e8`,
                        borderRadius: 8, background: image && preview ? "#fff" : "#fbfcfe",
                        cursor: "pointer", textAlign: "center", overflow: "hidden"
                      }}>
                        {image && preview ? (
                          <>
                            <img src={preview} alt={`Service preview ${index + 1}`} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #e1e6f0" }} />
                            <strong style={{ color: "#10183f", fontSize: 10 }}>Image selected</strong>
                            <span style={{ color: "#07983f", fontSize: 9, fontWeight: 600 }}>↑ Change image</span>
                            <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); removeServiceImage(index); }} style={{
                              position: "absolute", top: 6, right: 6, width: 25, height: 25, border: 0,
                              borderRadius: "50%", background: "rgba(16,24,63,.86)", color: "#fff", cursor: "pointer", zIndex: 2
                            }}>×</button>
                          </>
                        ) : (
                          <>
                            <span style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 7, background: "#eef7f1", color: "#07983f", fontSize: 17, fontWeight: 700 }}>↑</span>
                            <strong style={{ color: "#10183f", fontSize: 10 }}>{index === 0 ? "Upload image" : "Add image"}</strong>
                            <span style={{ color: "#8991b8", fontSize: 8 }}>JPG, PNG or WebP. Max 5MB.</span>
                          </>
                        )}
                        <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { handleServiceImage(index, event.target.files?.[0]); event.target.value = ""; }} />
                      </label>
                    );
                  })}
                </div>
              </div>

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
                <select id="providerServiceDuration" name="providerServiceDuration" value={getScalarSelectValue(formData.providerServiceDuration)} onChange={handleChange} required>
                  <option value="" disabled>Select duration</option>
                  {durations.map((duration) => <option key={duration} value={duration}>{duration}</option>)}
                </select>
              </label>

              <label htmlFor="providerServiceNumberOfPeople">
                Number of people (per session)
                <select id="providerServiceNumberOfPeople" name="providerServiceNumberOfPeople" value={getScalarSelectValue(formData.providerServiceNumberOfPeople)} onChange={handleChange}>
                  <option value="" disabled>Select</option>
                  {peopleOptions.map((people) => <option key={people} value={people}>{people}</option>)}
                </select>
              </label>

              <div className="provider-areas-served-field">
                <label htmlFor="providerAreasServed-0">
                  Areas served *
                  <select id="providerAreasServed-0" value={getScalarSelectValue(areas[0])} onChange={(event) => handleAreaChange(0, event.target.value)} required>
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
                    <select id={`providerAreasServed-${index + 1}`} value={getScalarSelectValue(area)} onChange={(event) => handleAreaChange(index + 1, event.target.value)}>
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
              <span className="provider-add-another-service-note">You can add additional services from your provider dashboard after approval.</span>
              <button type="submit" className="provider-signup-save-continue-button">Save &amp; continue&nbsp;&nbsp;→</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
