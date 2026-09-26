// Created by:  Blake Ostler
// Edited by:  Blake Ostler

//TODO:  Need left section image from Raphael
//TODO:  Bring user's existing account information into the corresponding fields (right now they are blank user input fields)
//TODO:  Styling

// Got help from Google Gemini on various fields. I typed the code myself.

import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext.jsx";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";

export default function ProviderSignupPageOne() {
  const { formData, updateField } = useForm();
  const navigate = useNavigate();

  // A generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };
  
  const MAX_SIZE_MB = 5;
  const MAX_FILE_SIZE = MAX_SIZE_MB * 1024 * 1024;
  const MAX_FILE_SIZE_ALERT = `File is too large. Maximum size allowed is ${MAX_SIZE_MB}MB.`
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
	if (!file) return;
	if (file.size > MAX_FILE_SIZE) {
	  alert(MAX_FILE_SIZE_ALERT);
	  e.target.value = "";
	  return;
	}
	updateField("providerProfileImage", file);
	e.target.value = "";
  };

  //Validation; got help from Copilot for this. I typed the code myself.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    navigate("/provider/onboarding/page2");
  };

  return (
    <div className="provider-signup-page-container provider-signup-page1">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page1">
			<img src="path" alt="Provider sign-up decoration" />
		</div>
      </section>

      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={1} />
        <h2 className="provider-signup-step-header">Tell us about yourself</h2>
        <p className="provider-signup-form-step-header-caption">
          Let's start with the basics for your provider profile.
        </p>
        <form className="provider-signup-form-page1" onSubmit={handleSubmit}>
          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">
              Account information
            </p>
			<p className="provider-signup-form-step-header-caption">
				?We've pre-filled your account details. You can updated them in your account settings if needed.?
			</p>

            <label htmlFor="providerFirstName">
              First name
              <input
                type="text"
                id="providerFirstName"
                name="providerFirstName"
                placeholder="Enter your first name"
                value={formData.providerFirstName}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="providerLastName">
              Last name
              <input
                type="text"
                id="providerLastName"
                name="providerLastName"
                placeholder="Enter your last name"
                value={formData.providerLastName}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="providerEmail">
              Email address
              <input
                type="email"
                id="providerEmail"
                name="providerEmail"
                placeholder="Enter your email address"
                value={formData.providerEmail}
                onChange={handleChange}
                required
              />
            </label>

            <fieldset className="phone-fieldset">
              <legend>Phone number</legend>
              <div className="phone-input-container">
                <select
                  id="providerCountryCode"
                  name="providerCountryCode"
                  value={formData.providerCountryCode}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select country code
                  </option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+234">NG +234</option>
                </select>
                <input
                  type="tel"
                  id="providerPhoneNumber"
                  name="providerPhoneNumber"
                  placeholder="555 555 5555"
                  value={formData.providerPhoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </fieldset>
          </div>

          <div className="provider-signup-form-field-group">
            <p className="provider-signup-form-field-group-name">
              Provider information
            </p>
            <p className="provider-signup-form-field-group-name-caption">
              Provider type
            </p>

            <fieldset>
              <label>
                <input
                  type="radio"
                  name="providerType"
                  value="Individual"
                  checked={formData.providerType === "Individual"}
                  onChange={handleChange}
                  required
                />
                Individual
				<div className="provider-signup-form-field-group-name-caption">
					I offer services on my own
				</div>
              </label>

              <label>
                <input
                  type="radio"
                  name="providerType"
                  value="Business/Company"
                  checked={formData.providerType === "Business/Company"}
                  onChange={handleChange}
                  required
                />
                Business/Company
				<div className="provider-signup-form-field-group-name-caption">
					I represent a registered business
				</div>
              </label>
			  
			  <label>
                <input
                  type="radio"
                  name="providerType"
                  value="Team/Agency"
                  checked={formData.providerType === "Team/Agency"}
                  onChange={handleChange}
                  required
                />
                Team/Agency
				<div className="provider-signup-form-field-group-name-caption">
					We are a team of providers
				</div>
              </label>
            </fieldset>

            <p className="provider-signup-form-field-group-name">
              Profile photo
            </p>
			  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
			  <div
			    className="provider-profile-photo"
				style={{
				  width: "64px",
				  height: "64px",
				  borderRadius: "50%",
				  backgroundColor: "#f3f4f6",
				  display: "flex",
				  alignItems: "center",
				  justifyContent: "center",
				  overflow: "hidden",
				  border: "1px solid #d1d5db",
				  flexShrink: 0
				}}
			  >
			  {formData.providerProfileImage ? (
					<img
					  src={URL.createObjectURL(formData.providerProfileImage)}
					  alt={"Profile image thumbnail"}
					  style={{
					    width: "100%",
						height: "100%",
						objectFit: "cover"
					  }}
					/>
					) : (
					<span style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
					  No image
					</span>
				)}
				</div>
				<div>
            <label
			  htmlFor="providerProfileImage"
			  style={{
			    border: "1px solid #d1d5db",
				padding: "8px 16px",
				display: "inline-block",
				textAlign: "center",
				borderRadius: "6px",
				cursor: "pointer",
				backgroundColor: "#ffffff",
				fontWeight: "500",
				fontSize: "14px",
				color: "#374151"
			  }}
			>
			  Change photo
			  <input
			    type="file"
			    id="providerProfileImage"
			    name="providerProfileImage"
			    accept="image/jpeg, image/jpg, image/png, image/webp"
			    onChange={handleFileChange}
			    style={{ display: "none" }}
			  />
			</label>  
			<p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
			  JPG, PNG or WebP. Max 5MB per file.
			</p>
			</div>
			</div>
			
			
			
            <label htmlFor="providerLocation">
              Location
              <select
                id="providerLocation"
                name="providerLocation"
                value={formData.providerLocation}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select location
                </option>
                <option value="California, USA">California, USA</option>
                <option value="Lagos, Nigeria">Lagos, Nigeria</option>
              </select>
            </label>

            <label htmlFor="providerBio">
              Short bio
              <textarea
                id="providerBio"
                name="providerBio"
                rows="4"
                maxlength="500"
                placeholder="Tell customers a bit about yourself, your background and what you do (max 500 characters)."
                value={formData.providerBio}
                onChange={handleChange}
				required
              ></textarea>
            </label>
          </div>
          <button type="submit" className="save-continue-button">
            Save & continue
          </button>
        </form>
      </section>
    </div>
  );
}
