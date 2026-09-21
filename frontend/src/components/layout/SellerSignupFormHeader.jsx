//QUESTION:  Is "Save and exit" a desired feature?  If so, will it just create an application "record" or something that resides in a user profile or something?  If this is true, then the seller signup form pages are NOT currently set up to retrieve and populate existing information from a database.  Does there need to be "if logged in" logic?
// Got help from Google Gemini on the progress bar. I typed the code myself.

// Created by:  Blake Ostler
// Edited by:  Blake Ostler

import React from "react";

function SellerSignupFormHeader({ step }) {
  const totalSteps = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div className="seller-signup-form-header">
      <h1>Become a seller</h1>
      <p className="seller-signup-form-header-caption">
        Set up your seller provider and start selling your products on Matchet
      </p>
      <button className="save-and-exit-button">Save and exit</button>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        {totalSteps.map((num, index) => (
          <React.Fragment key={num}>
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: num <= step ? "#4CAF50" : "#e0e0e0",
                color: num <= step ? "#fff" : "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                zIndex: 1,
              }}
            >
              {num}
            </div>
            {index < totalSteps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "4px",
                  backgroundColor: num < step ? "#4CAF50" : "#e0e0e0",
                  margin: "0 -2px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="seller-signup-form-step-counter">Step {step} of 7</p>
    </div>
  );
}

export default SellerSignupFormHeader;
