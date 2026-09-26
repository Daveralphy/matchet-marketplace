// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext.jsx";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageOne() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  // A generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  //Validation; got help from Copilot for this. I typed the code myself.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    navigate("/register/page2");
  };

  return (
    <div className="seller-signup-page-container seller-signup-page1">
      <section className="seller-signup-left-section">
        <SellerSignupSideImage />
      </section>

      <section className="seller-signup-right-section">
        <SellerSignupFormHeader step={1} />
        <h2 className="seller-signup-step-header">Tell us about yourself</h2>
        <p className="seller-signup-form-step-header-caption">
          Let's start with the basics for your seller profile.
        </p>
        <form className="seller-signup-form-page1" onSubmit={handleSubmit}>
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
              Tell us how you'll be selling on Matchet
            </p>

            <fieldset>
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

            <label htmlFor="profile-photo">Profile photo</label>
            <p>???Not sure how to do file upload???</p>

            <label htmlFor="location">
              Location
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select location
                </option>
                <option value="california-usa">California, USA</option>
                <option value="lagos-nigeria">Lagos, Nigeria</option>
              </select>
            </label>

            <label htmlFor="sellerBio">
              Short bio (optional)
              <textarea
                id="sellerBio"
                name="sellerBio"
                rows="4"
                maxlength="500"
                placeholder="Tell customers a bit about yourself and your products (max 500 characters)."
                value={formData.sellerBio}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
          <button type="submit" className="save-continue-button">
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
