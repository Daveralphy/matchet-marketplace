// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageFour() {
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
    navigate("/register/page5");
  };

  return (
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
          Tell us how you'll get your products to customers.
        </p>
        <form className="seller-signup-form-page4" onSubmit={handleSubmit}>
          <div className="seller-signup-form-field-group">
            <fieldset>
              <legend className="seller-signup-form-field-group-name">
                Shipping options
              </legend>
              <p classname="seller-signup-form-field-group-name-caption">
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
                <br />
                <span className="sub-text">
                  I'll pack and ship orders myself
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
                <br />
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
                <br />
                <span className="sub-text">
                  Customers pick up from my location
                </span>
              </label>
            </fieldset>

            <fieldset>
              <legend className="seller-signup-form-field-group-name">
                Shipping regions
              </legend>
              <p classname="seller-signup-form-field-group-name-caption">
                Select where you'll deliver your products.
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
                <br />
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
                <br />
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
                <br />
                <span className="sub-text">
                  Choose specific cities or areas
                </span>
              </label>
            </fieldset>

            <fieldset>
              <legend className="seller-signup-form-field-group-name">
                Shipping fee
              </legend>
              <p classname="seller-signup-form-field-group-name-caption">
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
                <br />
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
                <br />
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
              <p classname="seller-signup-form-field-group-name-caption">
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
                <option value="1-2-business-days">1-2 business days</option>
                <option value="3-4-business-days">3-4 business days</option>
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
                maxlength="300"
                placeholder="e.g. Special handling instructions, holiday delays, etc. (max 300 characters)."
                value={formData.shippingNotes}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
          <button
            type="button"
            onClick={() => navigate("/register/page3")}
            className="back-button"
          >
            ← Back
          </button>
          <button className="save-continue-button" type="submit">
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
