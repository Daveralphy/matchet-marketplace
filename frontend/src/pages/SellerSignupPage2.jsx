// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageTwo() {
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

    navigate("/register/page3");
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

        .seller-signup-form-page2 {
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

        .seller-signup-form-page2 label {
          display: block;
          min-width: 0;
          margin-bottom: 12px;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .seller-signup-form-page2 label:last-of-type {
          margin-bottom: 0;
        }

        .seller-signup-form-page2 input,
        .seller-signup-form-page2 select,
        .seller-signup-form-page2 textarea {
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

        .seller-signup-form-page2 input,
        .seller-signup-form-page2 select {
          height: 40px;
          padding: 0 13px;
        }

        .seller-signup-form-page2 textarea {
          min-height: 78px;
          padding: 10px 13px;
          resize: vertical;
          line-height: 1.45;
        }

        .seller-signup-form-page2 input::placeholder,
        .seller-signup-form-page2 textarea::placeholder {
          color: #8c94bf;
        }

        .seller-signup-form-page2 input:focus,
        .seller-signup-form-page2 select:focus,
        .seller-signup-form-page2 textarea:focus {
          border-color: #07983f;
          box-shadow: 0 0 0 3px rgba(7, 152, 63, 0.08);
        }

        .seller-signup-form-page2 fieldset {
          min-width: 0;
          padding: 0;
          margin: 0 0 12px;
          border: 0;
        }

        .seller-signup-form-page2 legend {
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .phone-input-container {
          display: grid;
          grid-template-columns: 116px minmax(0, 1fr);
          gap: 8px;
          margin-top: 6px;
        }

        .phone-input-container select,
        .phone-input-container input {
          margin-top: 0;
        }

        /* Business logo upload */
        .seller-signup-upload.seller-signup-business-logo {
          min-height: 82px;
          box-sizing: border-box;
          margin-top: 4px;
          margin-bottom: 15px;
          padding: 13px 15px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          grid-template-rows: auto auto;
          column-gap: 12px;
          align-items: center;
          border: 1px dashed #cfd7e8;
          border-radius: 8px;
          background: #fbfcfe;
          cursor: pointer;
        }

        .seller-signup-upload-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          grid-row: 1 / 3;
          border-radius: 7px;
          background: #eef7f1;
          color: #07983f;
          font-size: 18px;
          font-weight: 700;
        }

        .seller-signup-upload.seller-signup-business-logo strong {
          align-self: end;
          color: #10183f;
          font-size: 12px;
          line-height: 1.2;
        }

        .seller-signup-upload.seller-signup-business-logo > span:nth-of-type(2) {
          align-self: start;
          color: #8991b8;
          font-size: 11px;
          line-height: 1.3;
        }

        .seller-signup-upload.seller-signup-business-logo input {
          display: none;
        }

        /* Tips */
        .seller-signup-tips {
          margin-top: 5px;
          padding: 13px 15px;
          border-radius: 8px;
          background: #f5f8ff;
        }

        .seller-signup-tips h4 {
          margin: 0 0 7px;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 700;
        }

        .seller-signup-tips ul {
          margin: 0;
          padding-left: 17px;
          color: #6670ad;
          font-size: 11px;
          line-height: 1.55;
        }

        .seller-signup-tips li {
          margin-bottom: 2px;
        }

        .seller-signup-tips li:last-child {
          margin-bottom: 0;
        }

        /* Navigation buttons */
        .seller-signup-form-page2 > .back-button {
          height: 47px;
          min-width: 105px;
          margin: 0 10px 28px 0;
          padding: 0 22px;
          border: 1px solid #d7deec;
          border-radius: 8px;
          background: #ffffff;
          color: #10183f;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .seller-signup-form-page2 > .back-button:hover {
          background: #f8f9fc;
          border-color: #cbd3e4;
        }

        .seller-signup-form-page2 > .save-continue-button {
          height: 47px;
          min-width: 225px;
          margin: 0 0 28px auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

        .seller-signup-form-page2 > .save-continue-button:hover {
          background: #068936;
        }

        .seller-signup-form-page2 {
          display: flex;
          flex-direction: column;
        }

        .seller-signup-form-page2 > .seller-signup-form-field-group {
          width: 100%;
        }

        .seller-signup-form-page2 > .back-button {
          align-self: flex-start;
        }

        .seller-signup-form-page2 > .save-continue-button {
          align-self: flex-end;
          margin-top: -75px;
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

          .seller-signup-form-page2 {
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

          .seller-signup-form-page2 {
            margin-left: 18px;
            margin-right: 18px;
          }

          .seller-signup-form-page2 > .back-button,
          .seller-signup-form-page2 > .save-continue-button {
            width: 100%;
            margin: 0 0 12px;
          }

          .seller-signup-form-page2 > .save-continue-button {
            margin-bottom: 28px;
          }
        }
      `}</style>

      <div className="seller-signup-page-container seller-signup-page2">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={2} />

          <h2 className="seller-signup-step-header">
            Business information
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Tell us about your business so customers can trust your store.
          </p>

          <form
            className="seller-signup-form-page2"
            onSubmit={handleSubmit}
            noValidate
          >
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

              <label htmlFor="businessReg">
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
                  <option value="home-living">Home &amp; Living</option>
                  <option value="electronics">Electronics</option>
                </select>
              </label>

              <label htmlFor="businessDesc">
                Business description *
                <textarea
                  id="businessDesc"
                  name="businessDesc"
                  rows="4"
                  maxLength="500"
                  placeholder="Tell us about your business, what you sell, and what makes it unique (max 500 characters)."
                  value={formData.businessDesc}
                  onChange={handleChange}
                  required
                />
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

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                />
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
              Save &amp; continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}