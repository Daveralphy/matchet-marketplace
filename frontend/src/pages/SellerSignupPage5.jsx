// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageFive() {
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
    navigate("/register/page6");
  };

  return (
    <div className="seller-signup-page-container seller-signup-page5">
      <section className="seller-signup-left-section">
        <SellerSignupSideImage />
      </section>
      <section className="seller-signup-right-section">
        <SellerSignupFormHeader step={5} />
        <h2 className="seller-signup-step-header">Verify your identity</h2>
        <p className="seller-signup-form-step-header-caption">
          Help us keep Matchet safe and built trust with our community.
        </p>
        <form className="seller-signup-form-page5" onSubmit={handleSubmit}>
          <div className="seller-signup-form-field-group">
            <p className="seller-signup-form-field-group-name">
              Identity document
            </p>
            <p className="seller-signup-form-field-group-name-caption">
              Upload a valid government-issued ID
            </p>

            <label htmlFor="idType">
              ID Type *
              <select
                id="idType"
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select ID type
                </option>
                <option value="Driver License">Driver License</option>
                <option value="National ID Card">National ID Card</option>
                <option value="Passport">Passport</option>
              </select>
            </label>

            <label htmlFor="idNumber">
              ID number *
              <input
                type="password"
                id="idNumber"
                name="idNumber"
                placeholder="Enter your ID number"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </label>

            <p>???Not sure how to do front of ID file upload???</p>
            <p>???Not sure how to do back of ID file upload???</p>
            <p>???Insert tips for successful verification image???</p>
          </div>

          <div className="seller-signup-form-field-group">
            <p className="seller-signup-form-field-group-name">
              Selfie verification
            </p>
            <p className="seller-signup-form-field-group-name-caption">
              Take a clear selfie so we can match it with your ID
            </p>
            <p>???Not sure how to do selfie file upload???</p>
            <p>???Insert tips for a good selfie image???</p>
          </div>
          <p className="importantText">
            Your information is secure. We use industry-standard encryption to
            keep your data safe and only for verification purposes.
          </p>
          <button
            type="button"
            onClick={() => navigate("/register/page4")}
            className="back-button"
          >
            ← Back
          </button>
          <button
            className="save-continue-button"
            type="submit"
          >
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
