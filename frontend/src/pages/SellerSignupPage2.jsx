// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageTwo() {
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
    navigate("/register/page3");
  };

  return (
    <div className="seller-signup-page-container seller-signup-page2">
      <section className="seller-signup-left-section">
        <SellerSignupSideImage />
      </section>
      <section className="seller-signup-right-section">
        <SellerSignupFormHeader step={2} />
        <h2 className="seller-signup-step-header">Business information</h2>
        <p className="seller-signup-form-step-header-caption">
          Tell us about your business so customers can trust your store.
        </p>
        <form className="seller-signup-form-page2" onSubmit={handleSubmit}>
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

            <label htmlFor="businessRegistration">
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
                <option value="home-living">Home & Living</option>
                <option value="electronics">Electronics</option>
              </select>
            </label>

            <label htmlFor="businessDesc">
              Business description *
              <textarea
                id="businessDesc"
                name="businessDesc"
                rows="4"
                maxlength="500"
                placeholder="Tell us about your business, what you sell, and what makes it unique (max 500 characters)."
                value={formData.businessDesc}
                onChange={handleChange}
                required
              ></textarea>
            </label>

            <label htmlFor="businessAddress">
              Business address *
              <select
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                required
              >
                <option value="???dropdown to find???">
                  ???dropdown to find???
                </option>
              </select>
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
              <span className="seller-signup-upload-icon">↑</span>
              <strong>Upload your logo</strong>
              <span>JPG, PNG or WebP. Max 5MB.</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" />
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
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
