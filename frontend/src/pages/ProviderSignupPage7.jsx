// Created by:  Blake Ostler
// Edited by:  Blake Ostler

// TODO:  Need left section image from Raphael
// TODO:  If "Save and add another service" from page 2 is implemented, then not sure how to capture it in FormContext and then display it on page 7 summary
// TODO:  For Payment details:  how is the information "verified"?  How incorporate that?
// TODO:  Need logic for "Submit for review" button
// TODO:  Styling

// Got help from Google Gemini on various fields. I typed the code myself.

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../context/FormContext";
import ProviderSignupFormHeader from "../components/layout/ProviderSignupFormHeader";

export default function ProviderSignupPageSeven() {
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

  // Availability helper function to calculate Mon - Fri summary
  const getMonFriSummary = () => {
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const enabledWeekdays = weekdays.filter(
      (day) => formData.providerAvailability[day]?.enabled,
    );

    if (enabledWeekdays.length === 0) {
      return "Not available";
    }

    if (enabledWeekdays.length < 5) {
      return "Varies";
    }

    const startTimes = enabledWeekdays.map(
      (day) => formData.providerAvailability[day].startTime,
    );
    const endTimes = enabledWeekdays.map(
      (day) => formData.providerAvailability[day].endTime,
    );

    const allStartSame = startTimes.every((time) => time === startTimes[0]);
    const allEndSame = endTimes.every((time) => time === endTimes[0]);

    const startTimeDisplay = allStartSame
      ? startTimes[0] || "Not set"
      : "Various";
    const endTimeDisplay = allEndSame ? endTimes[0] || "Not set" : "Various";

    return `${startTimeDisplay} - ${endTimeDisplay}`;
  };

  // Availability helper function for Saturday and Sunday summary
  const getWeekendSummary = (dayKey) => {
    const dayData = formData.providerAvailability[dayKey];
    if (!dayData || !dayData.enabled) {
      return "Not available";
    }
    return `${dayData.startTime || "Not set"} - ${dayData.endTime || "Not set"}`;
  };

  return (
    <div className="provider-signup-page-container provider-signup-page7">
      <section className="provider-signup-left-section">
        <div className="provider-signup-side-banner provider-signup-side-banner-page7">
          <img src="path" alt="Provider sign-up decoration" />
        </div>
      </section>
      <section className="provider-signup-right-section">
        <ProviderSignupFormHeader step={7} />
        <h2 className="provider-signup-step-header">Review and submit</h2>
        <p className="provider-signup-form-step-header-caption">
          Please review your information below. You can go back and make changes
          if needed.
        </p>
        <div className="provider-signup-verification-card">
          <h3 className="provider-signup-verification-card-your-details-heading">
            Your details
          </h3>
          <Link
            to="/provider/onboarding"
            className="provider-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          {formData.providerProfileImage ? (
            <div
              className="provider-signup-verification-profile-image"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #ccc",
              }}
            >
              <img
                src={URL.createObjectURL(formData.providerProfileImage)}
                alt={"Profile image thumbnail"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : (
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                textAlign: "center",
              }}
            >
              No photo uploaded
            </span>
          )}
          <p className="provider-signup-verification-card-provider-name">
            {formData.providerFirstName} {formData.providerLastName}
          </p>
          <p>{formData.providerType}</p>
          <p>{formData.providerEmail}</p>
          <p>
            {formData.providerCountryCode} {formData.providerPhoneNumber}
          </p>
          <p>{formData.providerLocation}</p>
        </div>
        <div className="provider-signup-verification-card">
          <h3 className="provider-signup-verification-card-services-heading">
            Your services
          </h3>
          <Link
            to="/provider/onboarding/page2"
            className="provider-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <table>
            <tbody>
              <tr>
                <td>{formData.providerServiceName}</td>
                <td>From {formData.providerServicePrice}</td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="provider-signup-verification-provider-service-desc"
                >
                  {formData.providerServiceDesc}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="provider-signup-verification-card">
          <h3 className="provider-signup-verification-card-experience-heading">
            Experience & portfolio
          </h3>
          <Link
            to="/provider/onboarding/page3"
            className="provider-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <p>{formData.providerYearsofExperience} years of experience</p>
          <p>Specialized in {formData.providerAreasofExpertise}</p>
          {formData.providerPortfolioMedia &&
            formData.providerPortfolioMedia.length > 0 && (
              <div
                className="provider-portfolio-previews"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                  alignItems: "center",
                }}
              >
                {formData.providerPortfolioMedia
                  .slice(0, 3)
                  .map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "90px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        {file.type.startsWith("video/") ? (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "#333",
                              color: "#fff",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              borderRadius: "6px",
                              border: "1px solid #ddd",
                            }}
                          >
                            <span>🎬</span>
                            <span
                              style={{ fontSize: "10px", marginTop: "2px" }}
                            >
                              Video
                            </span>
                          </div>
                        ) : (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Portfolio preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #ddd",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                {formData.providerPortfolioMedia.length > 3 && (
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "6px",
                      border: "1px dashed #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#555",
                    }}
                  >
                    +{formData.providerPortfolioMedia.length - 3} more
                  </div>
                )}
              </div>
            )}
        </div>
        <div className="provider-signup-verification-card">
          <h3 className="provider-signup-verification-card-availability-heading">
            Availability & service area
          </h3>
          <Link
            to="/provider/onboarding/page4"
            className="provider-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <div className="provider-signup-verification-card-availability-left">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontWeight: "600" }}>Mon - Fri</span>
              <span>{getMonFriSummary()}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontWeight: "600" }}>Saturday</span>
              <span>{getWeekendSummary("saturday")}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontWeight: "600" }}>Sunday</span>
              <span>{getWeekendSummary("sunday")}</span>
            </div>
          </div>
          <div className="provider-signup-verification-card-availability-right">
            <p>Service areas</p>
            {formData.providerServiceArea === "specificLocations" && (
              <div className="provider-radius-output">
                {formData.providerServiceAreaSpecificLocations?.length > 0
                  ? `${formData.providerServiceAreaSpecificLocations?.join(", ")} and nearby areas`
                  : "None specified"}
              </div>
            )}
            {formData.providerServiceArea === "Within a radius" && (
              <div className="provider-radius-output">
                {formData.providerServiceAreaRadius}-km radius of{" "}
                {formData.providerLocation}
              </div>
            )}
            {formData.providerServiceArea === "Remote/Online only" && (
              <div className="provider-radius-output">Remote/Online only</div>
            )}
            <p>Service type</p>
            <p>{formData.providerServiceArea}</p>
          </div>
        </div>
        <div className="provider-signup-verification-card">
          <h3 className="provider-signup-verification-card-id-verification-heading">
            Identity verification
          </h3>
          <Link
            to="/provider/onboarding/page5"
            className="seller-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <div className="provider-signup-verification-card-id-left">
            <div className="seller-signup-verification-card-id-submitted">
              <p>{formData.providerIdType || "ID type not provided"}</p>
              <div className="seller-signup-verification-card-id-submitted-text">
                {formData.providerIdImageFront &&
                formData.providerIdImageBack ? (
                  <span style={{ color: "#2e7d32" }}>Images Submitted</span>
                ) : (
                  <span style={{ color: "#d32f2f" }}>Images not submitted</span>
                )}
              </div>
              <p>
                ID ending in{" "}
                {formData.providerIdNumber
                  ? formData.providerIdNumber.slice(-4)
                  : "ID # not provided"}
              </p>
            </div>
          </div>
          <div className="provider-signup-verification-card-id-right">
            Selfie
            <div className="seller-signup-verification-card-selfie-submitted-text">
              {formData.providerSelfieImage ? (
                <span style={{ color: "#2e7d32" }}>Submitted</span>
              ) : (
                <span style={{ color: "#d32f2f" }}>Not submitted</span>
              )}
            </div>
          </div>
        </div>
        <div className="seller-signup-verification-card">
          <h3 className="seller-signup-verification-card-payment-details-heading">
            Payment details
          </h3>
          <Link
            to="/provider/onboarding/page6"
            className="seller-signup-verification-card-edit-link"
          >
            Edit
          </Link>
          <div className="provider-signup-verification-card-payment-left">
            <p>{formData.providerBankName}</p>
            <p>{formData.providerAccountName}</p>
            <p>{maskSensitiveData(formData.providerAccountNumber)}</p>
          </div>
          <div className="provider-signup-verification-card-payment-right">
            <div className="seller-signup-verification-card-selfie-submitted">
              ???Indicate if verified???
            </div>
          </div>
        </div>
        <p className="importantText">
          By submitting, you agree to Matchet's
          <Link to="#">Provider Terms and Conditions</Link>. We will review your
          application and notify you once your provider profile has been
          approved.
        </p>
        <button
          type="button"
          onClick={() => navigate("/provider/onboarding/page6")}
          className="back-button"
        >
          ← Back
        </button>
        <button className="save-button">Submit for review →</button>
      </section>
    </div>
  );
}
