// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageFour() {
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

    navigate("/register/page5");
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

        .seller-signup-form-page4 {
          margin-left: 44px;
          margin-right: 44px;
          display: flex;
          flex-direction: column;
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

        .seller-signup-form-page4 fieldset {
          min-width: 0;
          padding: 0;
          margin: 0 0 18px;
          border: 0;
        }

        .seller-signup-form-page4 fieldset:last-of-type {
          margin-bottom: 16px;
        }

        .seller-signup-form-page4 legend {
          padding: 0;
          margin: 0;
          color: #10183f;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .seller-signup-form-page4
          .seller-signup-form-field-group-name-caption {
          margin: 4px 0 10px;
          color: #7079b0;
          font-size: 12px;
          line-height: 1.4;
        }

        .seller-signup-form-page4 fieldset > label {
          min-height: 54px;
          box-sizing: border-box;
          margin-bottom: 8px;
          padding: 10px 14px;
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr);
          grid-template-rows: auto auto;
          column-gap: 10px;
          align-items: center;
          border: 1px solid #dce2ef;
          border-radius: 7px;
          background: #ffffff;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
          cursor: pointer;
        }

        .seller-signup-form-page4 fieldset > label:last-child {
          margin-bottom: 0;
        }

        .seller-signup-form-page4 fieldset > label input[type="radio"] {
          width: 18px;
          height: 18px;
          grid-row: 1 / 3;
          margin: 0;
          accent-color: #07983f;
        }

        .seller-signup-form-page4 .sub-text {
          grid-column: 2;
          color: #8991b8;
          font-size: 10px;
          line-height: 1.3;
          font-weight: 400;
        }

        .seller-signup-form-page4 > .seller-signup-form-field-group > label {
          display: block;
          min-width: 0;
          margin-bottom: 13px;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .seller-signup-form-page4
          > .seller-signup-form-field-group
          > label:last-child {
          margin-bottom: 0;
        }

        .seller-signup-form-page4 input,
        .seller-signup-form-page4 select,
        .seller-signup-form-page4 textarea {
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

        .seller-signup-form-page4 input[type="radio"] {
          width: auto;
          margin-top: 0;
        }

        .seller-signup-form-page4 input[type="number"],
        .seller-signup-form-page4 select {
          height: 40px;
          padding: 0 13px;
        }

        .seller-signup-form-page4 textarea {
          min-height: 78px;
          padding: 10px 13px;
          resize: vertical;
          line-height: 1.45;
        }

        .seller-signup-form-page4 input::placeholder,
        .seller-signup-form-page4 textarea::placeholder {
          color: #8c94bf;
        }

        .seller-signup-form-page4 input:focus,
        .seller-signup-form-page4 select:focus,
        .seller-signup-form-page4 textarea:focus {
          border-color: #07983f;
          box-shadow: 0 0 0 3px rgba(7, 152, 63, 0.08);
        }

        .seller-signup-form-page4
          .seller-signup-form-field-group
          > label.seller-signup-form-field-group-name {
          color: #10183f;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .seller-signup-form-page4
          .seller-signup-form-field-group
          > label.seller-signup-form-field-group-name
          p {
          margin: 4px 0 0;
          color: #7079b0;
          font-size: 12px;
          line-height: 1.4;
          font-weight: 400;
        }

        /* Navigation buttons */
        .seller-signup-form-page4 > .back-button {
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

        .seller-signup-form-page4 > .back-button:hover {
          background: #f8f9fc;
          border-color: #cbd3e4;
        }

        .seller-signup-form-page4 > .save-continue-button {
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

        .seller-signup-form-page4 > .save-continue-button:hover {
          background: #068936;
        }

        .seller-signup-form-page4 > .back-button {
          align-self: flex-start;
        }

        .seller-signup-form-page4 > .save-continue-button {
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

          .seller-signup-form-page4 {
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

          .seller-signup-form-page4 {
            margin-left: 18px;
            margin-right: 18px;
          }

          .seller-signup-form-page4 > .back-button,
          .seller-signup-form-page4 > .save-continue-button {
            width: 100%;
            margin: 0 0 12px;
          }

          .seller-signup-form-page4 > .save-continue-button {
            margin-bottom: 28px;
          }
        }
      `}</style>

      <div className="seller-signup-page-container seller-signup-page4">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={4} />

          <h2 className="seller-signup-step-header">
            Set up shipping and delivery
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Tell us how you&apos;ll get your products to customers.
          </p>

          <form
            className="seller-signup-form-page4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="seller-signup-form-field-group">
              <fieldset>
                <legend className="seller-signup-form-field-group-name">
                  Shipping options
                </legend>

                <p className="seller-signup-form-field-group-name-caption">
                  Choose how you want to deliver your products.
                </p>

                <label>
                  <input
                    type="radio"
                    name="shippingOptions"
                    value="self"
                    checked={formData.shippingOptions === "self"}
                    onChange={handleChange}
                    required
                  />
                  I will handle shipping
                  <span className="sub-text">
                    I&apos;ll pack and ship orders myself
                  </span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="shippingOptions"
                    value="partner"
                    checked={formData.shippingOptions === "partner"}
                    onChange={handleChange}
                    required
                  />
                  Use a delivery partner
                  <span className="sub-text">
                    Use trusted logistics partners (e.g. GIG, Kwik, Sendbox)
                  </span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="shippingOptions"
                    value="Local"
                    checked={formData.shippingOptions === "Local"}
                    onChange={handleChange}
                    required
                  />
                  Local pickup only
                  <span className="sub-text">
                    Customers pick up from my location
                  </span>
                </label>
              </fieldset>

              <fieldset>
                <legend className="seller-signup-form-field-group-name">
                  Shipping regions
                </legend>

                <p className="seller-signup-form-field-group-name-caption">
                  Select where you&apos;ll deliver your products.
                </p>

                <label>
                  <input
                    type="radio"
                    name="shippingRegions"
                    value="Nationwide"
                    checked={formData.shippingRegions === "Nationwide"}
                    onChange={handleChange}
                    required
                  />
                  Nationwide
                  <span className="sub-text">
                    Deliver to all states in the country
                  </span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="shippingRegions"
                    value="states"
                    checked={formData.shippingRegions === "states"}
                    onChange={handleChange}
                    required
                  />
                  Specific states
                  <span className="sub-text">
                    Choose the states you deliver to
                  </span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="shippingRegions"
                    value="cities"
                    checked={formData.shippingRegions === "cities"}
                    onChange={handleChange}
                    required
                  />
                  Specific cities
                  <span className="sub-text">
                    Choose specific cities or areas
                  </span>
                </label>
              </fieldset>

              <fieldset>
                <legend className="seller-signup-form-field-group-name">
                  Shipping fee
                </legend>

                <p className="seller-signup-form-field-group-name-caption">
                  Set your shipping fee.
                </p>

                <label>
                  <input
                    type="radio"
                    name="shippingFee"
                    value="Flat"
                    checked={formData.shippingFee === "Flat"}
                    onChange={handleChange}
                    required
                  />
                  Flat rate
                  <span className="sub-text">
                    Same shipping fee for all orders
                  </span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="shippingFee"
                    value="Calculated"
                    checked={formData.shippingFee === "Calculated"}
                    onChange={handleChange}
                    required
                  />
                  Calculated rate
                  <span className="sub-text">
                    Fee based on location, weight or size
                  </span>
                </label>
              </fieldset>

              <label htmlFor="shippingFeeAmount">
                Shipping fee *
                <input
                  type="number"
                  id="shippingFeeAmount"
                  name="shippingFeeAmount"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.shippingFeeAmount}
                  onChange={handleChange}
                  required
                />
              </label>

              <label
                htmlFor="processingTime"
                className="seller-signup-form-field-group-name"
              >
                Processing time

                <p className="seller-signup-form-field-group-name-caption">
                  How long does it take you to prepare an order?
                </p>

                <select
                  id="processingTime"
                  name="processingTime"
                  value={formData.processingTime}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  <option value="1-2-business-days">
                    1-2 business days
                  </option>
                  <option value="3-4-business-days">
                    3-4 business days
                  </option>
                  <option value="1-week">1 week</option>
                </select>
              </label>

              <label
                htmlFor="shippingNotes"
                className="seller-signup-form-field-group-name"
              >
                Additional notes (optional)

                <textarea
                  id="shippingNotes"
                  name="shippingNotes"
                  rows="4"
                  maxLength="300"
                  placeholder="e.g. Special handling instructions, holiday delays, etc. (max 300 characters)."
                  value={formData.shippingNotes}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register/page3")}
              className="back-button"
            >
              ← Back
            </button>

            <button
              className="save-continue-button"
              type="submit"
            >
              Save &amp; continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}