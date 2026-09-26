// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext.jsx";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageOne() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      return;
    }

    navigate("/register/page2");
  };

  return (
    <>
      <style>{`
        .seller-signup-page-container {
          width: calc(100% - 40px);
          max-width: 1470px;
          height: calc(100vh - 26px);
          min-height: 0;
          margin: 13px auto;
          display: grid;
          grid-template-columns: 35% 65%;
          overflow: hidden;
          border: 1px solid #edf0f6;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 10px 35px rgba(16, 24, 63, 0.05);
        }

        .seller-signup-left-section {
          min-width: 0;
          min-height: 0;
          height: 100%;
          overflow: hidden;
          background: #f7faf9;
        }

        .seller-signup-left-section > * {
          width: 100%;
          height: 100%;
        }

        .seller-signup-right-section {
          min-width: 0;
          min-height: 0;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          background: #ffffff;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .seller-signup-right-section::-webkit-scrollbar {
          display: none;
        }

        .seller-signup-step-header {
          margin: 29px 44px 0;
          color: #10183f;
          font-size: 31px;
          line-height: 1.06;
          font-weight: 800;
          letter-spacing: -0.045em;
        }

        .seller-signup-form-step-header-caption {
          margin: 5px 44px 20px;
          color: #6670ad;
          font-size: 15px;
          line-height: 1.4;
        }

        .seller-signup-form-page1 {
          margin-left: 44px;
          margin-right: 44px;
        }

        .seller-signup-form-field-group {
          box-sizing: border-box;
          margin-bottom: 12px;
          padding: 15px 20px 17px;
          border: 1px solid #dfe5f1;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 3px 15px rgba(16, 24, 63, 0.02);
        }

        .seller-signup-form-field-group-name {
          margin: 0;
          color: #10183f;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .seller-signup-form-field-group-name-caption {
          margin: 4px 0 12px;
          color: #7079b0;
          font-size: 12px;
          line-height: 1.4;
        }

        .seller-signup-form-page1
          .seller-signup-form-field-group:first-child {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px 22px;
        }

        .seller-signup-form-page1
          .seller-signup-form-field-group:first-child
          > .seller-signup-form-field-group-name,
        .seller-signup-form-page1
          .seller-signup-form-field-group:first-child
          > .seller-signup-form-field-group-name-caption {
          grid-column: 1 / -1;
        }

        .seller-signup-form-page1
          .seller-signup-form-field-group:nth-child(2) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 22px;
        }

        .seller-signup-form-page1
          .seller-signup-form-field-group:nth-child(2)
          > .seller-signup-form-field-group-name,
        .seller-signup-form-page1
          .seller-signup-form-field-group:nth-child(2)
          > .seller-signup-form-field-group-name-caption {
          grid-column: 1 / -1;
        }

        .seller-signup-form-page1 label {
          display: block;
          min-width: 0;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .seller-signup-form-page1 input,
        .seller-signup-form-page1 select,
        .seller-signup-form-page1 textarea {
          width: 100%;
          box-sizing: border-box;
          margin-top: 6px;
          border: 1px solid #d7deec;
          border-radius: 7px;
          outline: none;
          background: #ffffff;
          color: #10183f;
          font-family: inherit;
          font-size: 12px;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .seller-signup-form-page1 input,
        .seller-signup-form-page1 select {
          height: 40px;
          padding: 0 13px;
        }

        .seller-signup-form-page1 textarea {
          min-height: 74px;
          padding: 10px 13px;
          resize: vertical;
          line-height: 1.45;
        }

        .seller-signup-form-page1 input::placeholder,
        .seller-signup-form-page1 textarea::placeholder {
          color: #8c94bf;
        }

        .seller-signup-form-page1 input:focus,
        .seller-signup-form-page1 select:focus,
        .seller-signup-form-page1 textarea:focus {
          border-color: #07983f;
          box-shadow: 0 0 0 3px rgba(7, 152, 63, 0.08);
        }

        .seller-signup-form-page1 fieldset {
          min-width: 0;
          padding: 0;
          margin: 0;
          border: 0;
        }

        .seller-signup-form-page1 .phone-fieldset {
          display: block;
        }

        .seller-signup-form-page1 legend {
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .phone-input-container {
          display: grid;
          grid-template-columns: 116px minmax(0, 1fr);
          gap: 8px;
        }

        .seller-signup-form-page1
          .seller-signup-form-field-group:nth-child(2)
          fieldset {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          grid-column: 1 / -1;
        }

        .seller-signup-form-page1
          .seller-signup-form-field-group:nth-child(2)
          fieldset
          label {
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 14px;
          border: 1px solid #dce2ef;
          border-radius: 7px;
          box-sizing: border-box;
          cursor: pointer;
        }

        .seller-signup-form-page1
          .seller-signup-form-field-group:nth-child(2)
          fieldset
          input {
          width: 20px;
          height: 20px;
          margin: 0;
          accent-color: #07983f;
        }

        /* Profile photo */
        .seller-signup-profile-upload-wrap {
          min-width: 0;
        }

        .seller-signup-form-field-label {
          display: block;
          margin-bottom: 8px;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .seller-signup-avatar-upload {
          display: flex;
          align-items: center;
          gap: 12px;
          width: fit-content;
          cursor: pointer;
        }

        .seller-signup-avatar-upload input {
          display: none;
        }

        .seller-signup-avatar-circle {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eef1f7;
          color: #10183f;
          font-size: 15px;
          font-weight: 700;
        }

        .seller-signup-change-photo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          box-sizing: border-box;
          padding: 0 14px;
          border: 1px solid #d7deec;
          border-radius: 7px;
          background: #ffffff;
          color: #10183f;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .seller-signup-upload-note {
          display: block;
          margin-top: 6px;
          color: #8991b8;
          font-size: 11px;
          line-height: 1.3;
        }

        .save-continue-button {
          height: 47px;
          min-width: 225px;
          margin: 0 0 28px auto;
          display: block;
          padding: 0 24px;
          border: 1px solid #07983f;
          border-radius: 8px;
          background: #07983f;
          color: #ffffff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .save-continue-button:hover {
          background: #068936;
        }

        @media (max-width: 1100px) {
          .seller-signup-page-container {
            grid-template-columns: 33% 67%;
          }

          .seller-signup-step-header {
            margin-left: 28px;
            margin-right: 28px;
            font-size: 28px;
          }

          .seller-signup-form-step-header-caption {
            margin-left: 28px;
            margin-right: 28px;
          }

          .seller-signup-form-page1 {
            margin-left: 28px;
            margin-right: 28px;
          }
        }

        @media (max-width: 820px) {
          .seller-signup-page-container {
            width: 100%;
            height: auto;
            min-height: 100vh;
            margin: 0;
            display: block;
            overflow: visible;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }

          .seller-signup-left-section {
            display: none;
          }

          .seller-signup-right-section {
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }

          .seller-signup-step-header {
            margin-left: 18px;
            margin-right: 18px;
            font-size: 27px;
          }

          .seller-signup-form-step-header-caption {
            margin-left: 18px;
            margin-right: 18px;
          }

          .seller-signup-form-page1 {
            margin-left: 18px;
            margin-right: 18px;
          }

          .seller-signup-form-page1
            .seller-signup-form-field-group:first-child,
          .seller-signup-form-page1
            .seller-signup-form-field-group:nth-child(2) {
            grid-template-columns: 1fr;
          }

          .seller-signup-form-page1
            .seller-signup-form-field-group:nth-child(2)
            fieldset {
            grid-template-columns: 1fr;
          }

          .save-continue-button {
            width: 100%;
            margin-right: 0;
          }
        }
      `}</style>

      <div className="seller-signup-page-container seller-signup-page1">
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

                <label className="seller-signup-avatar-upload">
                  <span className="seller-signup-avatar-circle">M</span>

                  <span className="seller-signup-change-photo">
                    ↑ Change photo
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                  />
                </label>

                <span className="seller-signup-upload-note">
                  JPG, PNG or WebP. Max 5MB.
                </span>
              </div>

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