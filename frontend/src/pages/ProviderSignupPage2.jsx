// Created by:  Blake Ostler
// Edited by:  Blake Ostler

//TODO:  Need left section image from Raphael
//TODO:  Generate dropdown menu for "Areas served" field
//TODO:  Logic/handling for "+ Add another location" button, including making sure it is included in the FormContext.
//TODO:  Logic/handling for "Save and add another service" button, including making sure the previously entered services are somehow saved in FormContext
//TODO:  Styling

// Got help from Google Gemini on various fields. I typed the code myself.

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";

export default function ProviderSignupPageTwo() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

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
    navigate("/provider/onboarding/page3");
  };

  return (
    <div className="provider-signup-page-container provider-signup-page2">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page2">
          <img src="path" alt="Provider sign-up decoration" />
        </div>
      </section>
      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={2} />
        <h2 className="provider-signup-step-header">
          Tell us about your services
        </h2>
        <p className="provider-signup-form-step-header-caption">
          Add the services you offer, set your pricing, and tell customers what
          to expect.
        </p>
        <form className="provider-signup-form-page2" onSubmit={handleSubmit}>
          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">
              Service details
            </p>
            <p className="provider-signup-form-step-header-caption">
              You can add more services later.
            </p>

            <label htmlFor="providerServiceCat">
              Service category *
              <select
                id="providerServiceCat"
                name="providerServiceCat"
                value={formData.providerServiceCat}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="food">Home</option>
                <option value="household-goods">Beauty</option>
                <option value="electronics">Photography</option>
              </select>
            </label>

            <label htmlFor="providerServiceName">
              Service name *
              <input
                type="text"
                id="providerServiceName"
                name="providerServiceName"
                placeholder="e.g. Home Cleaning, Makeup, Photography"
                value={formData.providerServiceName}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="providerServiceDesc">
              Service description *
              <textarea
                id="providerServiceDesc"
                name="providerServiceDesc"
                rows="4"
                maxlength="500"
                placeholder="Describe your service, what's included, and what makes it unique. (max 500 characters)."
                value={formData.providerServiceDesc}
                onChange={handleChange}
                required
              ></textarea>
            </label>

            <fieldset>
              <legend>Service type *</legend>
              <label>
                <input
                  type="radio"
                  name="providerServiceType"
                  value="In-person"
                  checked={formData.providerServiceType === "In-person"}
                  onChange={handleChange}
                  required
                />
                In-person
                <div className="provider-signup-form-field-group-name-caption">
                  I travel to customers
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  name="providerServiceType"
                  value="Remote"
                  checked={formData.providerServiceType === "Remote"}
                  onChange={handleChange}
                  required
                />
                Remote
                <div className="provider-signup-form-field-group-name-caption">
                  Delivered online
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  name="providerServiceType"
                  value="Both"
                  checked={formData.providerServiceType === "Both"}
                  onChange={handleChange}
                  required
                />
                Both
                <div className="provider-signup-form-field-group-name-caption">
                  In-person and remote
                </div>
              </label>
            </fieldset>

            <label htmlFor="providerServicePrice">
              Price *
              <input
                type="number"
                id="providerServicePrice"
                name="providerServicePrice"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.providerServicePrice}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="providerServiceDuration">
              Service duration *
              <select
                id="providerServiceDuration"
                name="providerServiceDuration"
                value={formData.providerServiceDuration}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select duration
                </option>
                <option value="1 hour or less">1 hour or less</option>
                <option value="1-2 hours">1-2 hours</option>
                <option value="2-3 hours">2-3 hours</option>
                <option value="3+ hours">3+ hours</option>
              </select>
            </label>

            <label htmlFor="providerServiceNumberOfPeople">
              Number of people (per session)
              <select
                id="providerServiceNumberOfPeople"
                name="providerServiceNumberOfPeople"
                value={formData.providerServiceNumberOfPeople}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select number of people
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
            </label>

            <label htmlFor="providerAreasServed">
              Areas served *
              <select
                id="providerAreasServed"
                name="providerAreasServed"
                value={formData.providerAreasServed}
                onChange={handleChange}
                required
              >
                <option value="???dropdown to find???">
                  ???dropdown to find???
                </option>
              </select>
            </label>

            <button
              type="button"
              className="provider-add-another-location-button"
            >
              + Add another location
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/provider/onboarding")}
            className="back-button"
          >
            ← Back
          </button>
          <button type="button" className="provider-add-another-service-button">
            Save and add another service
          </button>
          <button type="submit" className="save-continue-button">
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
