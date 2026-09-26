// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageThree() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleMultiChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    updateField(e.target.name, selectedValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      return;
    }

    navigate("/register/page4");
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

        .seller-signup-form-page3 {
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
          margin: 4px 0 12px;
          color: #7079b0;
          font-size: 12px;
          line-height: 1.4;
        }

        .seller-signup-form-page3 label {
          display: block;
          min-width: 0;
          margin-bottom: 12px;
          color: #10183f;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .seller-signup-form-page3 label:last-child {
          margin-bottom: 0;
        }

        .seller-signup-form-page3 input,
        .seller-signup-form-page3 select,
        .seller-signup-form-page3 textarea {
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

        .seller-signup-form-page3 input,
        .seller-signup-form-page3 select {
          height: 40px;
          padding: 0 13px;
        }

        .seller-signup-form-page3 textarea {
          min-height: 82px;
          padding: 10px 13px;
          resize: vertical;
          line-height: 1.45;
        }

        .seller-signup-form-page3 input::placeholder,
        .seller-signup-form-page3 textarea::placeholder {
          color: #8c94bf;
        }

        .seller-signup-form-page3 input:focus,
        .seller-signup-form-page3 select:focus,
        .seller-signup-form-page3 textarea:focus {
          border-color: #07983f;
          box-shadow: 0 0 0 3px rgba(7, 152, 63, 0.08);
        }

        /* Product images */
        .seller-signup-product-images {
          display: grid;
          grid-template-columns: minmax(0, 1.8fr) repeat(3, minmax(75px, 1fr)) 70px;
          gap: 9px;
          margin-bottom: 16px;
        }

        .seller-signup-product-upload {
          min-width: 0;
          min-height: 92px;
          box-sizing: border-box;
          margin-bottom: 0 !important;
          padding: 12px;
          display: grid !important;
          grid-template-columns: 34px minmax(0, 1fr);
          grid-template-rows: auto auto;
          column-gap: 10px;
          align-items: center;
          border: 1px dashed #cfd7e8;
          border-radius: 8px;
          background: #fbfcfe;
          cursor: pointer;
        }

        .seller-signup-product-upload input {
          display: none;
        }

        .seller-signup-product-upload .seller-signup-upload-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          grid-row: 1 / 3;
          border-radius: 7px;
          background: #eef7f1;
          color: #07983f;
          font-size: 17px;
          font-weight: 700;
        }

        .seller-signup-product-upload strong {
          align-self: end;
          color: #10183f;
          font-size: 11px;
          line-height: 1.2;
        }

        .seller-signup-product-upload > span:last-of-type {
          align-self: start;
          color: #8991b8;
          font-size: 9px;
          line-height: 1.3;
        }

        .seller-signup-product-thumb {
          min-width: 0;
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          border: 1px solid #dce2ef;
          border-radius: 8px;
          background: #f5f7fa;
          color: #8991b8;
          font-size: 10px;
          font-weight: 600;
        }

        .seller-signup-add-image {
          min-height: 92px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: 1px solid #d7deec;
          border-radius: 8px;
          background: #ffffff;
          color: #10183f;
          font-family: inherit;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
        }

        .seller-signup-add-image span {
          color: #6670ad;
          font-size: 9px;
          line-height: 1.2;
        }

        /* Tags multi-select */
        .seller-signup-form-page3 select[multiple] {
          height: 86px;
          padding: 7px 10px;
          overflow-y: auto;
        }

        .seller-signup-form-page3 select[multiple] option {
          padding: 5px 7px;
        }

        /* Navigation buttons */
        .seller-signup-form-page3 > .back-button {
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

        .seller-signup-form-page3 > .back-button:hover {
          background: #f8f9fc;
          border-color: #cbd3e4;
        }

        .seller-signup-form-page3 > .save-continue-button {
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

        .seller-signup-form-page3 > .save-continue-button:hover {
          background: #068936;
        }

        .seller-signup-form-page3 > .back-button {
          align-self: flex-start;
        }

        .seller-signup-form-page3 > .save-continue-button {
          align-self: flex-end;
          margin-top: -75px;
        }

        @media (max-width: 1150px) {
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

          .seller-signup-form-page3 {
            margin-left: 28px;
            margin-right: 28px;
          }

          .seller-signup-product-images {
            grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(60px, 1fr)) 60px;
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

          .seller-signup-form-page3 {
            margin-left: 18px;
            margin-right: 18px;
          }

          .seller-signup-product-images {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .seller-signup-product-upload {
            grid-column: 1 / -1;
          }

          .seller-signup-add-image {
            min-height: 75px;
          }

          .seller-signup-product-thumb {
            min-height: 75px;
          }

          .seller-signup-form-page3 > .back-button,
          .seller-signup-form-page3 > .save-continue-button {
            width: 100%;
            margin: 0 0 12px;
          }

          .seller-signup-form-page3 > .save-continue-button {
            margin-bottom: 28px;
          }
        }
      `}</style>

      <div className="seller-signup-page-container seller-signup-page3">
        <section className="seller-signup-left-section">
          <SellerSignupSideImage />
        </section>

        <section className="seller-signup-right-section">
          <SellerSignupFormHeader step={3} />

          <h2 className="seller-signup-step-header">
            Add your first product
          </h2>

          <p className="seller-signup-form-step-header-caption">
            Tell us about the product you want to sell. You can add more
            products later.
          </p>

          <form
            className="seller-signup-form-page3"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="seller-signup-form-field-group">
              <label
                htmlFor="productImages"
                className="seller-signup-form-field-group-name"
              >
                Product images *
              </label>

              <p className="seller-signup-form-field-group-name-caption">
                Upload clear photos of your product. You can add up to 5
                images.
              </p>

              <div className="seller-signup-product-images">
                <label className="seller-signup-product-upload">
                  <span className="seller-signup-upload-icon">↑</span>

                  <strong>Upload images</strong>

                  <span>JPG, PNG or WebP. Max 5MB each</span>

                  <input
                    id="productImages"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                  />
                </label>

                <div className="seller-signup-product-thumb">Basket</div>

                <div className="seller-signup-product-thumb">Basket</div>

                <div className="seller-signup-product-thumb">Basket</div>

                <button
                  type="button"
                  className="seller-signup-add-image"
                >
                  +
                  <span>Add more</span>
                </button>
              </div>

              <label htmlFor="productName">
                Product name *
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  placeholder="e.g. Handmade Woven Storage Basket"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="productCat">
                Product category *
                <select
                  id="productCat"
                  name="productCat"
                  value={formData.productCat}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="food">Food</option>
                  <option value="household-goods">Household Goods</option>
                  <option value="electronics">Electronics</option>
                </select>
              </label>

              <label htmlFor="productPrice">
                Price *
                <input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.productPrice}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="productComparePrice">
                Compare at price (optional)
                <input
                  type="number"
                  id="productComparePrice"
                  name="productComparePrice"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.productComparePrice}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="productStock">
                Stock quantity *
                <input
                  type="number"
                  id="productStock"
                  name="productStock"
                  min="0"
                  step="1"
                  placeholder="e.g. 10"
                  value={formData.productStock}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="productDesc">
                Product description *
                <textarea
                  id="productDesc"
                  name="productDesc"
                  rows="4"
                  maxLength="1000"
                  placeholder="Describe your product, its features, materials, dimensions, and anything else customers should know (max 1,000 characters)."
                  value={formData.productDesc}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="productCondition">
                Product condition *
                <select
                  id="productCondition"
                  name="productCondition"
                  value={formData.productCondition}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select condition
                  </option>
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="worn">Slightly worn</option>
                </select>
              </label>

              <label htmlFor="productSku">
                SKU (optional)
                <input
                  type="text"
                  id="productSku"
                  name="productSku"
                  placeholder="e.g. HC-001"
                  value={formData.productSku}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="productTags">
                Tags - use CTRL/CMD to select (optional)
                <select
                  id="productTags"
                  name="productTags"
                  value={formData.productTags}
                  onChange={handleMultiChange}
                  multiple
                >
                  <option value="" disabled>
                    e.g. home, decor, handmade
                  </option>
                  <option value="home">home</option>
                  <option value="decor">decor</option>
                  <option value="handmade">handmade</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register/page2")}
              className="back-button"
            >
              ← Back
            </button>

            <button
              type="submit"
              className="save-continue-button"
            >
              Save &amp; continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}