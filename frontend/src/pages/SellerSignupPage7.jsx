// TODO: Need logic for "Submit for review" button

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
    <>
      <style>{`
        .seller-signup-page-container {
          width: calc(100% - 40px);
          max-width: 1470px;
          height: calc(100vh - 26px);
          margin: 13px auto;
          display: grid;
          grid-template-columns: 35% 65%;
          overflow: hidden;
          border: 1px solid #eef0f5;
          border-radius: 14px;
          background: #fbfcfb;
          box-shadow: 0 10px 35px rgba(16, 24, 63, 0.05);
        }

        .seller-signup-left-section {
          height: 100%;
          min-width: 0;
          overflow: hidden;
          background: #fbfcfb;
        }

        .seller-signup-left-section > * {
          width: 100%;
          height: 100%;
        }

        .seller-signup-right-section {
          height: 100%;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 30px 48px 40px;
          box-sizing: border-box;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .seller-signup-right-section::-webkit-scrollbar {
          display: none;
        }

        .seller-signup-step-header {
          margin: 26px 0 8px;
          color: #10183f;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
        }

        .seller-signup-form-step-header-caption {
          margin: 0 0 26px;
          color: #7d86aa;
          font-size: 13px;
          line-height: 1.6;
        }

        .seller-signup-verification-card {
          position: relative;
          margin-bottom: 18px;
          padding: 20px;
          border: 1px solid #e4e8f1;
          border-radius: 10px;
          background: #ffffff;
          box-sizing: border-box;
        }

        .seller-signup-verification-card h3 {
          margin: 0 0 16px;
          padding-right: 70px;
          color: #10183f;
          font-size: 15px;
          line-height: 1.4;
          font-weight: 700;
        }

        .seller-signup-verification-card-edit-link {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #5666d9;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }

        .seller-signup-verification-card-edit-link:hover {
          text-decoration: underline;
        }

        .seller-signup-verification-card p {
          margin: 7px 0;
          color: #555f82;
          font-size: 13px;
          line-height: 1.5;
          word-break: break-word;
        }

        .seller-signup-verification-card-seller-name {
          color: #10183f !important;
          font-size: 15px !important;
          font-weight: 700;
        }

        .seller-signup-verification-card table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .seller-signup-verification-card td {
          padding: 10px 0;
          border-bottom: 1px solid #edf0f5;
          color: #555f82;
          font-size: 12px;
          line-height: 1.45;
          vertical-align: top;
          word-break: break-word;
        }

        .seller-signup-verification-card tr:last-child td {
          border-bottom: none;
          padding-bottom: 0;
        }

        .seller-signup-verification-card td:first-child {
          width: 38%;
          padding-right: 16px;
          color: #7d86aa;
        }

        .seller-signup-verification-card td:last-child {
          color: #10183f;
          font-weight: 500;
        }

        .seller-signup-verification-card-selfie-submitted {
          color: #b26a00 !important;
        }

        .seller-signup-review-thumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .seller-signup-review-thumbs span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          border: 1px solid #e1e6f0;
          border-radius: 7px;
          background: #f5f7fa;
          color: #7d86aa;
          font-size: 10px;
          text-align: center;
        }

        .importantText {
          margin: 18px 0 24px;
          padding: 14px 16px;
          border: 1px solid #dfe5f5;
          border-radius: 8px;
          background: #f6f8ff;
          color: #687296;
          font-size: 11px;
          line-height: 1.6;
        }

        .importantText a {
          color: #5666d9;
          font-weight: 600;
          text-decoration: none;
        }

        .importantText a:hover {
          text-decoration: underline;
        }

        .back-button,
        .save-button {
          height: 44px;
          box-sizing: border-box;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .back-button {
          padding: 0 18px;
          border: 1px solid #d7deec;
          background: #ffffff;
          color: #10183f;
        }

        .back-button:hover {
          background: #f8f9fc;
        }

        .save-button {
          float: right;
          min-width: 155px;
          padding: 0 20px;
          border: 1px solid #10183f;
          background: #10183f;
          color: #ffffff;
        }

        .save-button:hover {
          background: #17204f;
        }

        @media (max-width: 1100px) {
          .seller-signup-right-section {
            padding: 28px 32px 36px;
          }
        }

        @media (max-width: 820px) {
          .seller-signup-page-container {
            width: 100%;
            max-width: none;
            height: auto;
            min-height: 100vh;
            margin: 0;
            display: block;
            overflow: visible;
            border: none;
            border-radius: 0;
            box-shadow: none;
          }

          .seller-signup-left-section {
            display: none;
          }

          .seller-signup-right-section {
            width: 100%;
            height: auto;
            min-height: 100vh;
            overflow: visible;
            padding: 24px 20px 32px;
          }

          .seller-signup-step-header {
            margin-top: 22px;
            font-size: 24px;
          }

          .seller-signup-verification-card {
            padding: 16px;
          }

          .seller-signup-verification-card td:first-child {
            width: 42%;
            padding-right: 10px;
          }

          .seller-signup-review-thumbs span {
            width: 54px;
            height: 54px;
          }
        }

        @media (max-width: 480px) {
          .seller-signup-right-section {
            padding: 20px 16px 28px;
          }

          .seller-signup-verification-card {
            padding: 14px;
          }

          .seller-signup-verification-card td {
            font-size: 11px;
          }

          .seller-signup-verification-card td:first-child {
            width: 40%;
          }

          .back-button,
          .save-button {
            height: 42px;
          }

          .save-button {
            min-width: 145px;
          }
        }
      `}</style>

      <div className="seller-signup-page-container seller-signup-page7">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={7} />

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
              <tbody>
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
              </tbody>
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
                    ???Indicate if selfie submitted or not???
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
              to="/register/page6"
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

          <p className="importantText">
            By submitting, you agree to Matchet's{" "}
            <Link to="#">Seller Terms and Conditions</Link>. We will review your
            information and notify you once your seller profile has been
            approved.
          </p>

          <button
            type="button"
            onClick={() => navigate("/register/page6")}
            className="back-button"
          >
            ← Back
          </button>

          <button
            type="button"
            className="save-button"
          >
            Submit for review →
          </button>
        </section>
      </div>
    </>
  );
}