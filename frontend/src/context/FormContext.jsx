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
    // Initialize provider fields here
    providerFirstName: "",
    providerLastName: "",
    providerEmail: "",
    providerCountryCode: "",
    providerPhoneNumber: "",
    providerType: "",
    providerProfileImage: null,
    providerLocation: "",
    providerBio: "",
    providerServiceCat: "",
    providerServiceName: "",
    providerServiceDesc: "",
    providerServiceType: "",
    providerServicePrice: "",
    providerServiceDuration: "",
    providerServiceNumberOfPeople: "",
    providerAreasServed: "",
    providerYearsofExperience: "",
    providerAreasofExpertise: "",
    providerCertification: "",
    providerCertificationIssuingOrg: "",
    providerCertificationYearObtained: "",
    providerPortfolioMedia: [],
    providerPortfolioLink: "",
    providerAvailability: {
      monday: { enabled: false, startTime: "", endTime: "" },
      tuesday: { enabled: false, startTime: "", endTime: "" },
      wednesday: { enabled: false, startTime: "", endTime: "" },
      thursday: { enabled: false, startTime: "", endTime: "" },
      friday: { enabled: false, startTime: "", endTime: "" },
      saturday: { enabled: false, startTime: "", endTime: "" },
      sunday: { enabled: false, startTime: "", endTime: "" },
    },
    providerMinimumNoticeRequired: "",
    providerMaximumAdvanceBooking: "",
    providerResponseTime: "",
    providerServiceArea: "",
    providerServiceAreaSpecificLocations: [],
    providerServiceAreaRadius: "",
    providerIdType: "",
    providerIdNumber: "",
    providerIdImageFront: null,
    providerIdImageBack: null,
    providerSelfieImage: null,
    providerBankName: "",
    providerAccountNumber: "",
    providerAccountName: "",
    providerAccountType: "",
    providerBvn: "",
    providerTin: "",
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
