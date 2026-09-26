// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageFive() {
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

    navigate("/register/page6");
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

        .seller-signup-form-page5 {
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

        .seller-signup-form-page5 label:not(.seller-signup-upload) {
          display: block;
          min-width: 0;
          margin-bottom: 13px;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .seller-signup-form-page5
          .seller-signup-form-field-group
          > label:last-of-type {
          margin-bottom: 0;
        }

        .seller-signup-form-page5 input,
        .seller-signup-form-page5 select,
        .seller-signup-form-page5 textarea {
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

        .seller-signup-form-page5 input,
        .seller-signup-form-page5 select {
          height: 40px;
          padding: 0 13px;
        }

        .seller-signup-form-page5 input::placeholder {
          color: #8c94bf;
        }

        .seller-signup-form-page5 input:focus,
        .seller-signup-form-page5 select:focus {
          border-color: #07983f;
          box-shadow: 0 0 0 3px rgba(7, 152, 63, 0.08);
        }

        /* Identity uploads */
        .seller-signup-identity-upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 4px;
        }

        .seller-signup-upload {
          min-width: 0;
          min-height: 92px;
          box-sizing: border-box;
          padding: 13px 14px;
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          grid-template-rows: auto auto;
          column-gap: 11px;
          align-items: center;
          border: 1px dashed #cfd7e8;
          border-radius: 8px;
          background: #fbfcfe;
          cursor: pointer;
        }

        .seller-signup-upload input {
          display: none;
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

        .seller-signup-upload strong {
          align-self: end;
          color: #10183f;
          font-size: 12px;
          line-height: 1.2;
        }

        .seller-signup-upload > span:last-of-type {
          align-self: start;
          color: #8991b8;
          font-size: 10px;
          line-height: 1.3;
        }

        /* Tips */
        .seller-signup-tips {
          box-sizing: border-box;
          min-width: 0;
          padding: 13px 15px;
          border-radius: 8px;
          background: #f5f8ff;
        }

        .seller-signup-identity-upload-grid .seller-signup-tips {
          grid-column: 1 / -1;
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

        /* Selfie section */
        .seller-signup-selfie-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .importantText {
          margin: 2px 0 20px;
          padding: 12px 14px;
          border-radius: 7px;
          background: #f5f8ff;
          color: #6670ad;
          font-size: 11px;
          line-height: 1.5;
        }

        /* Navigation buttons */
        .seller-signup-form-page5 > .back-button {
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

        .seller-signup-form-page5 > .back-button:hover {
          background: #f8f9fc;
          border-color: #cbd3e4;
        }

        .seller-signup-form-page5 > .save-continue-button {
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

        .seller-signup-form-page5 > .save-continue-button:hover {
          background: #068936;
        }

        .seller-signup-form-page5 > .back-button {
          align-self: flex-start;
        }

        .seller-signup-form-page5 > .save-continue-button {
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

          .seller-signup-form-page5 {
            margin-left: 28px;
            margin-right: 28px;
          }

          .seller-signup-selfie-grid {
            grid-template-columns: 1fr;
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

          .seller-signup-form-page5 {
            margin-left: 18px;
            margin-right: 18px;
          }

          .seller-signup-identity-upload-grid {
            grid-template-columns: 1fr;
          }

          .seller-signup-identity-upload-grid .seller-signup-tips {
            grid-column: auto;
          }

          .seller-signup-selfie-grid {
            grid-template-columns: 1fr;
          }

          .seller-signup-form-page5 > .back-button,
          .seller-signup-form-page5 > .save-continue-button {
            width: 100%;
            margin: 0 0 12px;
          }

          .seller-signup-form-page5 > .save-continue-button {
            margin-bottom: 28px;
          }
        }
      `}</style>

      <div className="seller-signup-page-container seller-signup-page5">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={5} />

          <h2 className="seller-signup-step-header">
            Verify your identity
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Help us keep Matchet safe and build trust with our community.
          </p>

          <form
            className="seller-signup-form-page5"
            onSubmit={handleSubmit}
            noValidate
          >
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

                  <input
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                  />
                </label>

                <label className="seller-signup-upload">
                  <span className="seller-signup-upload-icon">↑</span>

                  <strong>Upload back of ID</strong>

                  <span>JPG, PNG or PDF. Max 5MB.</span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                  />
                </label>

                <div className="seller-signup-tips">
                  <h4>Tips for a successful verification</h4>

                  <ul>
                    <li>Use a valid, government-issued ID.</li>
                    <li>
                      Make sure the photos are clear and well-lit.
                    </li>
                    <li>
                      All information should be visible and readable.
                    </li>
                    <li>Do not edit or crop the document.</li>
                    <li>
                      The name on your ID should match your account details.
                    </li>
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

                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                  />
                </label>

                <div className="seller-signup-tips">
                  <h4>Tips for a good selfie</h4>

                  <ul>
                    <li>Be in a well-lit area.</li>
                    <li>Make sure your face is clearly visible.</li>
                    <li>
                      Do not wear sunglasses or a face covering.
                    </li>
                    <li>Look directly at the camera.</li>
                    <li>Use a neutral background.</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="importantText">
              Your information is secure. We use industry-standard encryption
              to keep your data safe and only for verification purposes.
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
              Save &amp; continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}