// Got help from Google Gemini. I typed everything myself and did not provide any code to the chat. Everything was a generic example and I adapted to this project.
// Consider modifying form field names to match names from database schema

import { createContext, useState, useContext } from "react";

// Create the context
const FormContext = createContext();

// Create a Provider component to wrap around the pages
export function FormProvider({ children }) {
  const [formData, setFormData] = useState({
    // Initialize from fields here
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNumber: "",
    sellerType: "",
    location: "",
    sellerBio: "",
    businessName: "",
    businessReg: "",
    businessCat: "",
    businessDesc: "",
    businessAddress: "",
    businessPhoneCountryCode: "",
    businessPhoneNumber: "",
    productName: "",
    productCat: "",
    productPrice: "",
    productComparePrice: "",
    productStock: "",
    productDesc: "",
    productCondition: "",
    productSku: "",
    productTags: [],
    shippingOptions: "",
    shippingRegions: "",
    shippingFee: "",
    shippingFeeAmount: "",
    processingTime: "",
    shippingNotes: "",
    idType: "",
    idNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    accountType: "",
    bvn: "",
    tin: "",
  });

  // Function to update a single field's value
  const updateField = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <FormContext.Provider value={{ formData, updateField }}>
      {children}
    </FormContext.Provider>
  );
}

// Custom hook for easy access in the pages
export function useForm() {
  return useContext(FormContext);
}
