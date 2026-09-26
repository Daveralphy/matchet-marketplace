// Created by:  Blake Ostler
// Edited by:  Blake Ostler

//TODO:  Need "Save and exit" logic

// Got help from Google Gemini on the progress bar. I typed the code myself.

import React from "react";

function ProviderSignupFormHeader({ step }) {
  const stepsData = [
    { num: 1, label: "Your Details" },
    { num: 2, label: "Services" },
    { num: 3, label: "Experience" },
    { num: 4, label: "Availability" },
    { num: 5, label: "Verification" },
    { num: 6, label: "Payment" },
    { num: 7, label: "Review" },
  ];
  return (
    <div className="provider-signup-form-header">
      <h1>Become a provider</h1>
      <p className="provider-signup-form-header-caption">
        Set up your provider provider and start offering your services on
        Matchet
      </p>
      <button className="save-and-exit-button">Save and exit</button>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "30px",
          marginTop: "20px",
        }}
      >
        {stepsData.map((s, index) => (
          <React.Fragment key={s.num}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "60px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  backgroundColor: s.num <= step ? "#4CAF50" : "#e0e0e0",
                  color: s.num <= step ? "#fff" : "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  zIndex: 1,
                }}
              >
                {s.num < step ? "✓" : s.num}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  marginTop: "6px",
                  color: s.num <= step ? "#333" : "#888",
                  fontWeight: s.num === step ? "bold" : "normal",
                }}
              >
                {s.label}
              </span>
            </div>
            {index < stepsData.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "4px",
                  backgroundColor: s.num < step ? "#4CAF50" : "#e0e0e0",
                  margin: "10px -5px 0 -5px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="provider-signup-form-step-counter">Step {step} of 7</p>
    </div>
  );
}

export default ProviderSignupFormHeader;
