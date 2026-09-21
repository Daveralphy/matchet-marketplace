// Created by:  Blake Ostler
// Edited by:  Blake Ostler

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import SellerSignupSideImage from "../components/layout/SellerSignupSideImage";
import SellerSignupFormHeader from "../components/layout/SellerSignupFormHeader";

export default function SellerSignupPageThree() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  // A generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  // Change handler for multi-select
  const handleMultiChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    updateField(e.target.name, selectedValues);
  };

  //Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    navigate("/register/page4");
  };

  return (
    <div className="seller-signup-page-container seller-signup-page3">
      <section className="seller-signup-left-section">
        <SellerSignupSideImage />
      </section>
      <section className="seller-signup-right-section">
        <SellerSignupFormHeader step={3} />
        <h2 className="seller-signup-step-header">Add your first product</h2>
        <p className="seller-signup-form-step-header-caption">
          Tell us about the product you want to sell. You can add more products
          later.
        </p>
        <form className="seller-signup-form-page3" onSubmit={handleSubmit}>
          <div className="seller-signup-form-field-group">
            <label
              htmlFor="productImages"
              className="seller-signup-form-field-group-name"
            >
              Product images *
            </label>
            <p className="seller-signup-form-field-group-name-caption">
              Upload clear photos of your product. You can add up to 5 images.
            </p>
            <p>???Not sure how to do file upload???</p>

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
                maxlength="1000"
                placeholder="Describe your product, its features, materials, dimensions, and anything else customers should know (max 1,000 characters)."
                value={formData.productDesc}
                onChange={handleChange}
                required
              ></textarea>
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
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
