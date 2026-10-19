// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitSellerOnboarding } from "../api/provider";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageSeven() {
  const { formData, clearForm } = useForm();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const maskSensitiveData = (value) => {
    if (!value) return "";

    const str = String(value);

    if (str.length <= 4) {
      const lastDigit = str.slice(-1);
      return "****" + lastDigit;
    }

    const lastFour = str.slice(-4);
    const maskedPart = "*".repeat(str.length - 4);

    return maskedPart + lastFour;
  };

  return (
    <>
      <div className="seller-signup-page-container seller-signup-page7 ob-seller-step">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={5} />

          <h2 className="seller-signup-step-header">
            Review and submit
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Check your information below. You can go back and make changes if
            needed.
          </p>

          <div className="seller-signup-verification-card">
            <h3 className="seller-signup-verification-card-your-details-heading">
              Your details
            </h3>

            <Link
              to="/register"
              className="seller-signup-verification-card-edit-link"
            >
              Edit
            </Link>

            <p className="seller-signup-verification-card-seller-name">
              {formData.firstName} {formData.lastName}
            </p>

            <p>{formData.sellerType}</p>
            <p>{formData.email}</p>

            <p>
              {formData.countryCode} {formData.phoneNumber}
            </p>

            <p>{formData.location}</p>
          </div>

          <div className="seller-signup-verification-card">
            <h3 className="seller-signup-verification-card-business-info-heading">
              Business information
            </h3>

            <Link
              to="/register/page2"
              className="seller-signup-verification-card-edit-link"
            >
              Edit
            </Link>

            <table>
              <tbody>
                <tr>
                  <td>Business name</td>
                  <td>{formData.businessName}</td>
                </tr>

                <tr>
                  <td>Business category</td>
                  <td>{formData.businessCat}</td>
                </tr>

                <tr>
                  <td>Business address</td>
                  <td>{formData.businessAddress}</td>
                </tr>

                <tr>
                  <td>Business phone</td>
                  <td>
                    {formData.businessPhoneCountryCode}{" "}
                    {formData.businessPhoneNumber}
                  </td>
                </tr>

                <tr>
                  <td>Business description</td>
                  <td>{formData.businessDesc}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="seller-signup-verification-card">
            <h3 className="seller-signup-verification-card-id-verification-heading">
              Identity verification
            </h3>

            <Link
              to="/register/page3"
              className="seller-signup-verification-card-edit-link"
            >
              Edit
            </Link>

            <table>
              <tbody>
                <tr>
                  <td>ID type</td>
                  <td>{formData.idType}</td>
                </tr>

                <tr>
                  <td>ID number</td>
                  <td>{maskSensitiveData(formData.idNumber)}</td>
                </tr>

                <tr>
                  <td>Selfie</td>
                  <td className="seller-signup-verification-card-selfie-submitted">
                    {formData.selfieImage ? "Submitted" : "Not submitted"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="seller-signup-verification-card">
            <h3 className="seller-signup-verification-card-payment-details-heading">
              Payment details
            </h3>

            <Link
              to="/register/page4"
              className="seller-signup-verification-card-edit-link"
            >
              Edit
            </Link>

            <table>
              <tbody>
                <tr>
                  <td>Bank name</td>
                  <td>{formData.bankName}</td>
                </tr>

                <tr>
                  <td>Account number</td>
                  <td>{maskSensitiveData(formData.accountNumber)}</td>
                </tr>

                <tr>
                  <td>Account name</td>
                  <td>{formData.accountName}</td>
                </tr>

                <tr>
                  <td>Account type</td>
                  <td>{formData.accountType}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {submitError && <div role="alert" className="seller-signup-submit-error">{submitError}</div>}

          <p className="importantText">
            By submitting, you agree to Matchet's{" "}
            <Link to="/terms">Terms of Service</Link>. We will review your
            information and notify you once your seller profile has been
            approved.
          </p>

          <button
            type="button"
            onClick={() => navigate("/register/page4")}
            className="back-button"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={async () => {
              setSubmitting(true);
              setSubmitError("");
              try {
                await submitSellerOnboarding(formData);
                await refreshUser();
                clearForm();
                navigate("/register/page6");
              } catch (error) {
                const invalidFields = error.missingFields?.length ? error.missingFields : Object.keys(error.errors || {});
                if (invalidFields.length) {
                  try { sessionStorage.setItem("matchet_onboarding_field_errors", JSON.stringify({ flow: "seller", fields: invalidFields, errors: error.errors || {} })); } catch {}
                  const isBusiness = (field) => /businessName|businessReg|businessCat|businessDesc|businessAddress|businessPhone|businessLogo/i.test(field);
                  const isIdentity = (field) => /idType|idNumber|idImage|selfie/i.test(field);
                  const isPayment = (field) => /bankName|accountNumber|accountName|accountType|bvn|tin/i.test(field);
                  const target = invalidFields.some(isBusiness) ? "/register/page2" : invalidFields.some(isIdentity) ? "/register/page3" : invalidFields.some(isPayment) ? "/register/page4" : "/register";
                  navigate(target);
                  return;
                }
                setSubmitError(/validation failed|cast to embedded|objectexpectederror|casterror/i.test(error.message || "")
                  ? "Some required information is missing or invalid. Please review your application and complete the highlighted fields."
                  : error.message || "Unable to submit your seller application.");
              } finally {
                setSubmitting(false);
              }
            }}
            className="save-button"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit for review →"}
          </button>
        </section>
      </div>
    </>
  );
}