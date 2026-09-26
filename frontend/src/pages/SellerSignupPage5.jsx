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

            <div className="seller-signup-identity-upload-grid">
              <label className="seller-signup-upload">
                <span className="seller-signup-upload-icon">↑</span>
                <strong>Upload front of ID</strong>
                <span>JPG, PNG or PDF. Max 5MB.</span>
                <input type="file" accept="image/png,image/jpeg,application/pdf" />
              </label>
              <label className="seller-signup-upload">
                <span className="seller-signup-upload-icon">↑</span>
                <strong>Upload back of ID</strong>
                <span>JPG, PNG or PDF. Max 5MB.</span>
                <input type="file" accept="image/png,image/jpeg,application/pdf" />
              </label>
              <div className="seller-signup-tips">
                <h4>Tips for a successful verification</h4>
                <ul>
                  <li>Use a valid, government-issued ID.</li>
                  <li>Make sure the photos are clear and well-lit.</li>
                  <li>All information should be visible and readable.</li>
                  <li>Do not edit or crop the document.</li>
                  <li>The name on your ID should match your account details.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="seller-signup-form-field-group">
            <p className="seller-signup-form-field-group-name">
              Selfie verification
            </p>
            <p className="seller-signup-form-field-group-name-caption">
              Take a clear selfie so we can match it with your ID
            </p>
            <div className="seller-signup-selfie-grid">
              <label className="seller-signup-upload">
                <span className="seller-signup-upload-icon">↑</span>
                <strong>Upload a selfie</strong>
                <span>JPG or PNG. Max 5MB.</span>
                <input type="file" accept="image/png,image/jpeg" />
              </label>
              <div className="seller-signup-tips">
                <h4>Tips for a good selfie</h4>
                <ul>
                  <li>Be in a well-lit area.</li>
                  <li>Make sure your face is clearly visible.</li>
                  <li>Do not wear sunglasses or a face covering.</li>
                  <li>Look directly at the camera.</li>
                  <li>Use a neutral background.</li>
                </ul>
              </div>
            </div>
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
