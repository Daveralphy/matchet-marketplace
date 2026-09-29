import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";
import sideImage from "../assets/inspirations/provider/provideronboarding.png";
import "../styles/provider-onboarding.css";

function InfoIcon() {
  return <span className="provider-payment-info-icon">i</span>;
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 20 6v5.5c0 4.7-3.2 8.2-8 9.5-4.8-1.3-8-4.8-8-9.5V6l8-2.5Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

const banks = [
  "Access Bank",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank",
  "Globus Bank",
  "Guaranty Trust Bank",
  "Keystone Bank",
  "Moniepoint",
  "Opay",
  "Polaris Bank",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Union Bank",
  "United Bank for Africa",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

export default function ProviderSignupPageSix() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const accountName = useMemo(() => {
    const firstName = formData.providerFirstName?.trim() || "";
    const lastName = formData.providerLastName?.trim() || "";
    return [firstName, lastName].filter(Boolean).join(" ");
  }, [formData.providerFirstName, formData.providerLastName]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    navigate("/provider/onboarding/page7");
  };

  return (
    <div className="provider-signup-page-container provider-signup-page6">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page6">
          <img src={sideImage} alt="Get paid for what you do" />
        </div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={6} />

        <div className="provider-signup-form-page6">
          <h2 className="provider-signup-step-header">Set up your payment details</h2>
          <p className="provider-signup-form-step-header-caption">
            Tell us where you would like to receive your earnings. Your payments are secure with Matchet.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <section className="provider-payment-card">
              <div className="provider-payment-main">
                <h3>Bank account information</h3>
                <p>Your earnings will be paid directly to this bank account.</p>

                <div className="provider-payment-fields">
                  <label htmlFor="providerBankName">
                    Bank name *
                    <select
                      id="providerBankName"
                      name="providerBankName"
                      value={formData.providerBankName || ""}
                      onChange={(event) => updateField("providerBankName", event.target.value)}
                      required
                    >
                      <option value="" disabled>Select your bank</option>
                      {banks.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
                    </select>
                  </label>

                  <label htmlFor="providerAccountNumber">
                    Account number *
                    <input
                      id="providerAccountNumber"
                      name="providerAccountNumber"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="Enter your account number"
                      value={formData.providerAccountNumber || ""}
                      onChange={(event) => updateField("providerAccountNumber", event.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                    />
                  </label>

                  <label htmlFor="providerAccountName">
                    Account name *
                    <input
                      id="providerAccountName"
                      name="providerAccountName"
                      type="text"
                      value={accountName}
                      placeholder="This will be verified automatically"
                      readOnly
                      required
                    />
                  </label>

                  <label htmlFor="providerAccountType">
                    Account type *
                    <select
                      id="providerAccountType"
                      name="providerAccountType"
                      value={formData.providerAccountType || ""}
                      onChange={(event) => updateField("providerAccountType", event.target.value)}
                      required
                    >
                      <option value="" disabled>Select account type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </label>
                </div>

                <div className="provider-payment-verification">
                  <InfoIcon />
                  <div>
                    <strong>Account verification</strong>
                    <p>We will verify that the account name matches your details to ensure secure payouts.<br />This usually takes a few seconds.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="provider-payment-additional">
              <h3>Additional information (optional)</h3>
              <p>This information helps us process your payments smoothly.</p>

              <div className="provider-payment-fields">
                <label htmlFor="providerBvn">
                  BVN (optional)
                  <input
                    id="providerBvn"
                    name="providerBvn"
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    pattern="[0-9]{11}"
                    placeholder="Enter your BVN"
                    value={formData.providerBvn || ""}
                    onChange={(event) => updateField("providerBvn", event.target.value.replace(/\D/g, "").slice(0, 11))}
                  />
                </label>

                <label htmlFor="providerTin">
                  Tax identification number (optional)
                  <input
                    id="providerTin"
                    name="providerTin"
                    type="text"
                    placeholder="Enter your TIN (if applicable)"
                    value={formData.providerTin || ""}
                    onChange={(event) => updateField("providerTin", event.target.value)}
                  />
                </label>
              </div>
            </section>

            <div className="provider-payment-security">
              <ShieldIcon />
              <span>Your payment information is encrypted and stored securely. Matchet does not share your bank details with third parties.</span>
            </div>

            <div className="provider-signup-page6-actions">
              <button type="button" className="provider-signup-back-button" onClick={() => navigate("/provider/onboarding/page5")}>←&nbsp;&nbsp;Back</button>
              <button type="submit" className="provider-signup-save-continue-button">Save &amp; continue&nbsp;&nbsp;→</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
