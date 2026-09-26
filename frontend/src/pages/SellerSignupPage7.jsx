// TODO:  Need logic for "Submit for review" button

// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageSeven() {
  const { formData } = useForm();
  const navigate = useNavigate();

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
    <div className="seller-signup-page-container seller-signup-page7">
      <section className="seller-signup-left-section">
        <SellerSignupSideImage />
      </section>
      <section className="seller-signup-right-section">
        <SellerSignupFormHeader step={7} />
        <h2 className="seller-signup-step-header">Review and submit</h2>
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
          </table>
        </div>
        <div className="seller-signup-verification-card">
          <h3 className="seller-signup-verification-card-products-heading">
            Products
          </h3>
          <Link
            to="/register/page3"
            className="seller-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <p>{formData.productName}</p>
          <p>
            {formData.productPrice} | {formData.productStock} in stock
          </p>
          <div className="seller-signup-review-thumbs">
            <span>Basket</span>
            <span>Basket</span>
            <span>Basket</span>
            <span>+3</span>
          </div>
        </div>
        <div className="seller-signup-verification-card">
          <h3 className="seller-signup-verification-card-shipping-details-heading">
            Shipping & delivery
          </h3>
          <Link
            to="/register/page4"
            className="seller-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <table>
            <tr>
              <td>Shipping option</td>
              <td>{formData.shippingOptions}</td>
            </tr>
            <tr>
              <td>Shipping regions</td>
              <td>{formData.shippingRegions}</td>
            </tr>
            <tr>
              <td>Shipping fee</td>
              <td>
                {formData.shippingFee} - {formData.shippingFeeAmount}
              </td>
            </tr>
            <tr>
              <td>Processing time</td>
              <td>{formData.processingTime}</td>
            </tr>
          </table>
        </div>
        <div className="seller-signup-verification-card">
          <h3 className="seller-signup-verification-card-id-verification-heading">
            Identity verification
          </h3>
          <Link
            to="/register/page5"
            className="seller-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <table>
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
                ???Indicate if selfie submitted or not???
              </td>
            </tr>
          </table>
        </div>
        <div className="seller-signup-verification-card">
          <h3 className="seller-signup-verification-card-payment-details-heading">
            Payment details
          </h3>
          <Link
            to="/register/page6"
            className="seller-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <table>
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
          </table>
        </div>
        <p className="importantText">
          By submitting, you agree to Matchet's{" "}
          <Link to="#">Seller Terms and Conditions</Link>. We will review your
          information and notify you once your seller profile has been approved.
        </p>
        <button
          type="button"
          onClick={() => navigate("/register/page6")}
          className="back-button"
        >
          ← Back
        </button>
        <button className="save-button">Submit for review →</button>
      </section>
    </div>
  );
}
