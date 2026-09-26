// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageSix() {
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

    navigate("/register/page7");
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

        .seller-signup-form-page6 {
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

        .seller-signup-form-field-group-name {
          margin: 0;
          color: #10183f;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .seller-signup-form-field-group-name-caption {
          margin: 4px 0 13px;
          color: #7079b0;
          font-size: 12px;
          line-height: 1.4;
        }

        .seller-signup-form-page6 label {
          display: block;
          min-width: 0;
          margin-bottom: 13px;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .seller-signup-form-page6
          .seller-signup-form-field-group
          label:last-of-type {
          margin-bottom: 0;
        }

        .seller-signup-form-page6 input,
        .seller-signup-form-page6 select {
          width: 100%;
          height: 40px;
          box-sizing: border-box;
          margin-top: 6px;
          padding: 0 13px;
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

        .seller-signup-form-page6 input::placeholder {
          color: #8c94bf;
        }

        .seller-signup-form-page6 input:focus,
        .seller-signup-form-page6 select:focus {
          border-color: #07983f;
          box-shadow: 0 0 0 3px rgba(7, 152, 63, 0.08);
        }

        .seller-signup-form-page6 input:disabled {
          background: #f5f7fa;
          color: #7d86ae;
          cursor: not-allowed;
        }

        .importantPaymentsText,
        .importantText {
          box-sizing: border-box;
          margin: 14px 0 0;
          padding: 12px 14px;
          border-radius: 7px;
          background: #f5f8ff;
          color: #6670ad;
          font-size: 11px;
          line-height: 1.5;
        }

        .importantText {
          margin: 2px 0 20px;
        }

        /* Navigation buttons */
        .seller-signup-form-page6 > .back-button {
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

        .seller-signup-form-page6 > .back-button:hover {
          background: #f8f9fc;
          border-color: #cbd3e4;
        }

        .seller-signup-form-page6 > .save-continue-button {
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

        .seller-signup-form-page6 > .save-continue-button:hover {
          background: #068936;
        }

        .seller-signup-form-page6 > .back-button {
          align-self: flex-start;
        }

        .seller-signup-form-page6 > .save-continue-button {
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

          .seller-signup-form-page6 {
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

          .seller-signup-form-page6 {
            margin-left: 18px;
            margin-right: 18px;
          }

          .seller-signup-form-page6 > .back-button,
          .seller-signup-form-page6 > .save-continue-button {
            width: 100%;
            margin: 0 0 12px;
          }

          .seller-signup-form-page6 > .save-continue-button {
            margin-bottom: 28px;
          }
        }
      `}</style>

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
            Tell us where you would like to receive your earnings. Your
            payments are secure with Matchet.
          </p>

          <form
            className="seller-signup-form-page6"
            onSubmit={handleSubmit}
            noValidate
          >
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
                  <option value="First State Bank">
                    First State Bank
                  </option>
                  <option value="Associated Credit Union">
                    Associated Credit Union
                  </option>
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
                Your payments are secure. We use industry-standard encryption
                to keep your financial information safe. Your bank details are
                only used to process payments to you.
              </p>
            </div>

            <div className="seller-signup-form-field-group">
              <p className="seller-signup-form-field-group-name">
                Additional information (optional)
              </p>

              <p className="seller-signup-form-field-group-name-caption">
                This helps us comply with financial regulations and process
                your payments smoothly.
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
              You can update your payment details later in your account
              settings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/register/page5")}
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