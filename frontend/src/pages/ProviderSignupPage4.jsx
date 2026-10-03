import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { saveProviderOnboardingDraft } from "../api/provider";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3.5v4M16.5 3.5v4M3.5 9h17M8 13h3M13 13h3M8 17h3" /></svg>;
}

function LocationIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function PeopleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3.5 20c.5-3.8 2.4-5.8 5.5-5.8s5 2 5.5 5.8M14 15.5c2.7-.3 5 1.1 5.7 4.5" /></svg>;
}

function ServiceAreaIcon({ type }) {
  if (type === "specificLocations") return <LocationIcon />;
  if (type === "radius") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" /><path d="M12 4v3M20 12h-3M12 20v-3M4 12h3" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" /><path d="M8 10h8M8 14h5" /></svg>;
}

export default function ProviderSignupPageFour() {
  const { formData, updateField, mergeFormData } = useForm();
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState("");

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const timeSlots = Array.from({ length: 48 }, (_, index) => {
    const totalMinutes = index * 30;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${hours12}:${minutes === 0 ? "00" : String(minutes).padStart(2, "0")} ${period}`;
  });

  const serviceArea = formData.providerServiceArea || "specificLocations";
  const locations = formData.providerServiceAreaSpecificLocations || [];

  const handleAvailabilityChange = (dayKey, field, value) => {
    const currentAvailability = formData.providerAvailability || {};
    updateField("providerAvailability", {
      ...currentAvailability,
      [dayKey]: {
        ...(currentAvailability[dayKey] || { enabled: false, startTime: "", endTime: "" }),
        [field]: value,
      },
    });
  };

  const addLocation = () => {
    const value = locationInput.trim();
    if (!value || locations.includes(value)) return;
    updateField("providerServiceAreaSpecificLocations", [...locations, value]);
    setLocationInput("");
  };

  const removeLocation = (location) => {
    updateField("providerServiceAreaSpecificLocations", locations.filter((item) => item !== location));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    try {
      const response = await saveProviderOnboardingDraft(formData);
      if (response?.data?.formData) mergeFormData(response.data.formData);      if (response?.data?.formData) mergeFormData(response.data.formData);
      navigate("/provider/onboarding/page5");
    } catch (error) {
      alert(error.message || "Unable to save your progress. Please try again.");
    }
  };

  return (
    <div className="provider-signup-page-container provider-signup-page4">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page4">
          <img src={sideImage} alt="Set your availability, reach more people" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={4} />

        <div className="provider-signup-form-page4">
          <h2 className="provider-signup-step-header">Set your availability &amp; service area</h2>
          <p className="provider-signup-form-step-header-caption">
            Let customers know when you are available and where you provide your services.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="provider-availability-booking-card">
              <div className="provider-availability-section">
                <div className="provider-step4-section-title">Availability</div>
                <p>Set the days and hours you are available to take bookings.</p>

                <div className="provider-availability-days">
                  {daysOfWeek.map((day) => {
                    const data = formData.providerAvailability?.[day.key] || { enabled: false, startTime: "", endTime: "" };
                    return (
                      <div className="provider-availability-row" key={day.key}>
                        <label className="provider-day-toggle">
                          <input
                            type="checkbox"
                            checked={Boolean(data.enabled)}
                            onChange={(event) => handleAvailabilityChange(day.key, "enabled", event.target.checked)}
                          />
                          <span className="provider-custom-check">{data.enabled ? "✓" : ""}</span>
                          <span>{day.label}</span>
                        </label>

                        <select value={data.startTime || ""} disabled={!data.enabled} onChange={(event) => handleAvailabilityChange(day.key, "startTime", event.target.value)}>
                          <option value="" disabled>{data.enabled ? "Start time" : "Not available"}</option>
                          {timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}
                        </select>
                        <span className="provider-time-separator">−</span>
                        <select value={data.endTime || ""} disabled={!data.enabled} onChange={(event) => handleAvailabilityChange(day.key, "endTime", event.target.value)}>
                          <option value="" disabled>{data.enabled ? "End time" : "Not available"}</option>
                          {timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}
                        </select>
                        <span className="provider-add-time-note" aria-hidden="true">+</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="provider-booking-preferences">
                <div className="provider-step4-section-title">Booking preferences</div>
                <p>Help customers understand how to book you.</p>

                <label htmlFor="providerMinimumNoticeRequired">
                  Minimum notice required
                  <select id="providerMinimumNoticeRequired" name="providerMinimumNoticeRequired" value={formData.providerMinimumNoticeRequired || ""} onChange={(event) => updateField("providerMinimumNoticeRequired", event.target.value)} required>
                    <option value="" disabled>Select</option>
                    <option value="2 hours or less">2 hours or less</option>
                    <option value="12 hours">12 hours</option>
                    <option value="1 day">1 day</option>
                    <option value="1 week">1 week</option>
                  </select>
                </label>

                <label htmlFor="providerMaximumAdvanceBooking">
                  Maximum advance booking
                  <select id="providerMaximumAdvanceBooking" name="providerMaximumAdvanceBooking" value={formData.providerMaximumAdvanceBooking || ""} onChange={(event) => updateField("providerMaximumAdvanceBooking", event.target.value)} required>
                    <option value="" disabled>Select</option>
                    <option value="12 hours">12 hours</option>
                    <option value="1 day">1 day</option>
                    <option value="1 week">1 week</option>
                    <option value="1 month">1 month</option>
                  </select>
                </label>

                <label htmlFor="providerResponseTime">
                  Typical response time
                  <select id="providerResponseTime" name="providerResponseTime" value={formData.providerResponseTime || ""} onChange={(event) => updateField("providerResponseTime", event.target.value)} required>
                    <option value="" disabled>Select</option>
                    <option value="1 hour">1 hour</option>
                    <option value="12 hours">12 hours</option>
                    <option value="1 day">1 day</option>
                    <option value="1 week">1 week</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="provider-service-area-card">
              <div className="provider-step4-section-title">Service area</div>
              <p>Choose the locations where you provide your services.</p>

              <fieldset className="provider-service-area-options">
                {[
                  { value: "specificLocations", title: "Specific locations", description: "Select cities, neighborhoods or areas" },
                  { value: "radius", title: "Within a radius", description: "Set a distance from your location" },
                  { value: "remote", title: "Remote / Online only", description: "I provide services online only" },
                ].map((option) => (
                  <label key={option.value} className={`provider-service-area-option ${serviceArea === option.value ? "is-selected" : ""}`}>
                    <input type="radio" name="providerServiceArea" value={option.value} checked={serviceArea === option.value} onChange={(event) => updateField("providerServiceArea", event.target.value)} required />
                    <span className="provider-service-area-radio">{serviceArea === option.value ? "●" : ""}</span>
                    <span className="provider-service-area-icon"><ServiceAreaIcon type={option.value} /></span>
                    <span className="provider-service-area-copy"><strong>{option.title}</strong><small>{option.description}</small></span>
                  </label>
                ))}
              </fieldset>

              {serviceArea === "specificLocations" && (
                <>
                  <div className="provider-service-location-input">
                    <LocationIcon />
                    <input
                      type="text"
                      value={locationInput}
                      placeholder="Search and select locations (e.g. Lagos, Ikeja, Victoria Island)"
                      onChange={(event) => setLocationInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addLocation();
                        }
                      }}
                    />
                  </div>
                  <div className="provider-location-tags">
                    {locations.map((location) => (
                      <span className="provider-location-tag" key={location}>
                        {location}
                        <button type="button" onClick={() => removeLocation(location)} aria-label={`Remove ${location}`}>×</button>
                      </span>
                    ))}
                  </div>
                </>
              )}

              {serviceArea === "radius" && (
                <div className="provider-service-radius-input">
                  <LocationIcon />
                  <input type="number" min="1" step="1" name="providerServiceAreaRadius" value={formData.providerServiceAreaRadius || ""} onChange={(event) => updateField("providerServiceAreaRadius", event.target.value)} placeholder="Enter service radius in kilometres" required />
                  <span>km</span>
                </div>
              )}
            </div>

            <div className="provider-signup-page4-actions">
              <button type="button" className="provider-signup-back-button" onClick={() => navigate("/provider/onboarding/page3")}>←&nbsp;&nbsp;Back</button>
              <button type="submit" className="provider-signup-save-continue-button">Save &amp; continue&nbsp;&nbsp;→</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
