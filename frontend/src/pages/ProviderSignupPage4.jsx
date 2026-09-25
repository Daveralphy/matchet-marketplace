// Created by:  Blake Ostler
// Edited by:  Blake Ostler

//TODO:  Need left section image from Raphael
//TODO:  Styling

// Got help from Google Gemini on Availability and the Service Area fields. I typed everything myself.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";

export default function ProviderSignupPageFour() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

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
    const formattedMinutes = minutes === 0 ? "00" : minutes;

    return `${hours12}:${formattedMinutes} ${period}`;
  });

  const [locationInput, setLocationInput] = useState("");

  const addLocation = () => {
    // No empty strings
    if (!locationInput.trim()) return;
    // Prevent duplicates
    if (
      formData.providerServiceAreaSpecificLocations.includes(
        locationInput.trim(),
      )
    )
      return;
    updateField("providerServiceAreaSpecificLocations", [
      ...formData.providerServiceAreaSpecificLocations,
      locationInput.trim(),
    ]);
    setLocationInput("");
  };

  const removeLocation = (locationToRemove) => {
    const updatedLocations =
      formData.providerServiceAreaSpecificLocations.filter(
        (loc) => loc !== locationToRemove,
      );
    updateField("providerServiceAreaSpecificLocations", updatedLocations);
  };

  const handleAvailabilityChange = (dayKey, field, value) => {
    const currentAvailability = formData.providerAvailability || {};
    const currentDayData = currentAvailability[dayKey] || {
      enabled: false,
      startTime: "",
      endTime: "",
    };
    const updatedDayData = {
      ...currentDayData,
      [field]: value,
    };

    const updateAvailability = {
      ...currentAvailability,
      [dayKey]: updatedDayData,
    };
    updateField("providerAvailability", updateAvailability);
  };

  // A generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  //Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    navigate("/provider/onboarding/page5");
  };

  return (
    <div className="provider-signup-page-container provider-signup-page4">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page4">
          <img src="path" alt="Provider sign-up decoration" />
        </div>
      </section>
      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={4} />
        <h2 className="provider-signup-step-header">
          Set your availability & service area
        </h2>
        <p className="provider-signup-form-step-header-caption">
          Let customers know when you are available and where you provide your
          services.
        </p>
        <form className="provider-signup-form-page4" onSubmit={handleSubmit}>
          <div className="provider-signup-form-field-group">
            <fieldset>
              <p className="provider-signup-form-field-group-name">
                Availability
              </p>
              <p className="provider-signup-form-step-header-caption">
                Set the days and hours you are available to take bookings.
              </p>

              {daysOfWeek.map((dayObj) => {
                const dayData = formData.providerAvailability?.[dayObj.key] || {
                  enabled: false,
                  startTime: "",
                  endTime: "",
                };
                return (
                  <div
                    key={dayObj.key}
                    className="availability-row"
                    style={{ marginBottom: "10px" }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={dayData.enabled}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            dayObj.key,
                            "enabled",
                            e.target.checked,
                          )
                        }
                      />
                      {dayObj.label}
                    </label>

                    <select
                      value={dayData.startTime}
                      disabled={!dayData.enabled}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          dayObj.key,
                          "startTime",
                          e.target.value,
                        )
                      }
                    >
                      <option value="" disabled></option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>

                    <span> - </span>

                    <select
                      value={dayData.endTime}
                      disabled={!dayData.enabled}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          dayObj.key,
                          "endTime",
                          e.target.value,
                        )
                      }
                    >
                      <option value="" disabled></option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}

              <p className="provider-signup-form-field-group-name">
                Booking preferences
              </p>
              <p className="provider-signup-form-step-header-caption">
                Help customers understand how to book you.
              </p>

              <label htmlFor="providerMinimumNoticeRequired">
                Minimum notice required
                <select
                  id="providerMinimumNoticeRequired"
                  name="providerMinimumNoticeRequired"
                  value={formData.providerMinimumNoticeRequired}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select minimum notice required
                  </option>
                  <option value="2 hours or less">2 hours or less</option>
                  <option value="12 hours">12 hours</option>
                  <option value="1 day">1 day</option>
                  <option value="1 week">1 week</option>
                </select>
              </label>

              <label htmlFor="providerMaximumAdvanceBooking">
                Maximum advance booking
                <select
                  id="providerMaximumAdvanceBooking"
                  name="providerMaximumAdvanceBooking"
                  value={formData.providerMaximumAdvanceBooking}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select maximum advance booking
                  </option>
                  <option value="12 hours">12 hours</option>
                  <option value="1 day">1 day</option>
                  <option value="1 week">1 week</option>
                  <option value="1 month">1 month</option>
                </select>
              </label>

              <label htmlFor="providerResponseTime">
                Typical response time
                <select
                  id="providerResponseTime"
                  name="providerResponseTime"
                  value={formData.providerResponseTime}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select typical response time
                  </option>
                  <option value="1 hour">1 hour</option>
                  <option value="12 hours">12 hours</option>
                  <option value="1 day">1 day</option>
                  <option value="1 week">1 week</option>
                </select>
              </label>
            </fieldset>

            <fieldset>
              <p className="provider-signup-form-field-group-name">
                Service area
              </p>
              <p className="provider-signup-form-step-header-caption">
                Choose the locations where you provide your services.
              </p>

              <label>
                <input
                  type="radio"
                  name="providerServiceArea"
                  value="specificLocations"
                  checked={formData.providerServiceArea === "specificLocations"}
                  onChange={handleChange}
                  required
                />
                Specific locations
                <div className="provider-signup-form-field-group-name-caption">
                  Select cities, neighborhoods or areas
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  name="providerServiceArea"
                  value="Within a radius"
                  checked={formData.providerServiceArea === "Within a radius"}
                  onChange={handleChange}
                  required
                />
                Within a radius
                <div className="provider-signup-form-field-group-name-caption">
                  Set a distance from your location
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  name="providerServiceArea"
                  value="Remote/Online only"
                  checked={
                    formData.providerServiceArea === "Remote/Online only"
                  }
                  onChange={handleChange}
                  required
                />
                Remote/Online only
                <div className="provider-signup-form-field-group-name-caption">
                  I provide services online only
                </div>
              </label>
              {formData.providerServiceArea === "specificLocations" && (
                <div className="provider-location-container">
                  <div className="provider-location-input-group">
                    <input
                      type="text"
                      placeholder="Search and select locations (e.g. Lagos, Ikeja, Victoria Island)"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLocation();
                        }
                      }}
                    />
                    <button type="button" onClick={addLocation}>
                      Add
                    </button>
                  </div>
                  <div className="provider-location-tags-container">
                    {formData.providerServiceAreaSpecificLocations.map(
                      (loc) => (
                        <span
                          key={loc}
                          className="location-tag"
                          style={{
                            display: "inline-block",
                            margin: "4px",
                            padding: "4px 8px",
                            background: "#eee",
                            borderRadius: "4px",
                          }}
                        >
                          {loc}
                          <button
                            type="button"
                            onClick={() => removeLocation(loc)}
                            style={{
                              marginLeft: "6px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            &times;
                          </button>
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
              {formData.providerServiceArea === "Within a radius" && (
                <div className="provider-radius-container">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="providerServiceAreaRadius"
                    value={formData.providerServiceAreaRadius}
                    onChange={handleChange}
                    placeholder="Enter a radius (km), e.g. 25"
                  />
                </div>
              )}
            </fieldset>
          </div>

          <button
            type="button"
            onClick={() => navigate("/provider/onboarding/page3")}
            className="back-button"
          >
            ← Back
          </button>

          <button type="submit" className="save-continue-button">
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
