// Created by:  Blake Ostler
// Edited by:  Blake Ostler

//TODO:  Need left section image from Raphael
//QUESTION:  How handle "This will be verified automatically" in Account name field?
//TODO:  Styling

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";

export default function ProviderSignupPageSix() {
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
    navigate("/provider/onboarding/page7");
  };

  return (
    <div className="provider-signup-page-container provider-signup-page6">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page6">
			<img src="path" alt="Provider sign-up decoration" />
		</div>
      </section>
      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={6} />
        <h2 className="provider-signup-step-header">
          Set up your payment details
        </h2>
        <p className="provider-signup-form-step-header-caption">
          Tell us where you would like to receive your earnings. Your payments
          are secure with Matchet.
        </p>
        <form className="provider-signup-form-page6" onSubmit={handleSubmit}>
          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">
              Bank account information
            </p>
            <p className="provider-signup-form-field-group-name-caption">
              Your earnings will be paid directly to this bank account.
            </p>

            <label htmlFor="providerBankName">
              Bank name *
              <select
                id="providerBankName"
                name="providerBankName"
                value={formData.providerBankName}
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

            <label htmlFor="providerAccountNumber">
              Account number *
              <input
                type="password"
                id="providerAccountNumber"
                name="providerAccountNumber"
                placeholder="Enter your account number"
                value={formData.providerAccountNumber}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="providerAccountName">
              Account name *
              <input
                type="text"
                id="providerAccountName"
                name="providerAccountName"
                placeholder="This will be verified automatically"
                value={formData.providerAccountName}
                onChange={handleChange}
                required
                disabled
              />
            </label>

            <label htmlFor="providerAccountType">
              Account Type *
              <select
                id="providerAccountType"
                name="providerAccountType"
                value={formData.providerAccountType}
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
              We will verify that the account name matches your details to ensure secure payouts.<br/>This usually takes a few seconds.
            </p>
          </div>

          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">
              Additional information (optional)
            </p>
            <p className="provider-signup-form-field-group-name-caption">
              This information help us process your
              payments smoothly.
            </p>

            <label htmlFor="providerBvn">
              BVN (optional)
              <input
                type="text"
                id="providerBvn"
                name="providerBvn"
                placeholder="Enter your BVN"
                value={formData.providerBvn}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="providerTin">
              Tax identification number (optional)
              <input
                type="password"
                id="providerTin"
                name="providerTin"
                placeholder="Enter your TIN (if applicable)"
                value={formData.providerTin}
                onChange={handleChange}
              />
            </label>
          </div>
		  <p className="importantText">
              Your payment information is encrypted and stored securely. Matchet does not share your bank details with third parties.
            </p>
          <button
            type="button"
            onClick={() => navigate("/provider/onboarding/page5")}
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
