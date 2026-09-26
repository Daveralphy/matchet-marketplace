// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageSix() {
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
    navigate("/register/page7");
  };

  return (
    <div className="seller-signup-page-container seller-signup-page6">
      <section className="seller-signup-left-section">
        <SellerSignupSideImage />
      </section>
      <section className="seller-signup-right-section">
        <SellerSignupFormHeader step={6} />
        <h2 className="seller-signup-step-header">
          Set up your payment details
        </h2>
        <p className="seller-signup-form-step-header-caption">
          Tell us where you would like to receive your earnings. Your payments
          are secure with Matchet.
        </p>
        <form className="seller-signup-form-page6" onSubmit={handleSubmit}>
          <div className="seller-signup-form-field-group">
            <p className="seller-signup-form-field-group-name">
              Bank account information
            </p>
            <p className="seller-signup-form-field-group-name-caption">
              Your earnings will be paid directly to this bank account.
            </p>

            <label htmlFor="bankName">
              Bank name *
              <select
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your bank
                </option>
                <option value="National Bank">National Bank</option>
                <option value="First State Bank">First State Bank</option>
                <option value="Associated Credit Union">Associated Credit Union</option>
              </select>
            </label>

            <label htmlFor="accountNumber">
              Account number *
              <input
                type="password"
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter your account number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="accountName">
              Account name *
              <input
                type="text"
                id="accountName"
                name="accountName"
                placeholder="This will be verified automatically"
                value={formData.accountName}
                onChange={handleChange}
                required
                disabled
              />
            </label>

            <label htmlFor="accountType">
              Account Type *
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select account type
                </option>
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
              </select>
            </label>

            <p className="importantPaymentsText">
              Your payments are secure. We use industry-standard encryption to
              keep your financial information safe. Your bank details are only
              used to process payments to you.
            </p>
          </div>

          <div className="seller-signup-form-field-group">
            <p className="seller-signup-form-field-group-name">
              Additional information (optional)
            </p>
            <p className="seller-signup-form-field-group-name-caption">
              This helps us comply with financial regulations and process your
              payments smoothly.
            </p>

            <label htmlFor="bvn">
              BVN (optional)
              <input
                type="text"
                id="bvn"
                name="bvn"
                placeholder="Enter your BVN"
                value={formData.bvn}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="tin">
              Tax identification number (optional)
              <input
                type="password"
                id="tin"
                name="tin"
                placeholder="Enter your TIN (if applicable)"
                value={formData.tin}
                onChange={handleChange}
              />
            </label>
          </div>
          <p className="importantText">
            You can update your payment details later in your account settings.
          </p>
          <button
            type="button"
            onClick={() => navigate("/register/page5")}
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
