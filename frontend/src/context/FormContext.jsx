// Got help from Google Gemini. I typed everything myself and did not provide any code to the chat. Everything was a generic example and I adapted to this project.
// Consider modifying form field names to match names from database schema

import { createContext, useState, useContext, useCallback, useEffect, useRef } from "react";

// Create the context
const FormContext = createContext();

// Create a Provider component to wrap around the pages
const FORM_STORAGE_KEY = "matchet_onboarding_forms";

function loadStoredForms() {
  try { return JSON.parse(sessionStorage.getItem(FORM_STORAGE_KEY) || "{}"); } catch { return {}; }
}
function normalizeOnboardingData(values) {
  if (!values || typeof values !== "object") return values;
  const next = { ...values };
  const scalarFields = [
    "firstName","lastName","email","countryCode","phoneNumber","sellerType","location","sellerBio",
    "businessName","businessReg","businessCat","businessDesc","businessAddress","businessPhoneCountryCode","businessPhoneNumber",
    "productName","productCat","productPrice","productComparePrice","productStock","productDesc","productCondition","productSku",
    "shippingOptions","shippingRegions","shippingFee","shippingFeeAmount","processingTime","shippingNotes","idType","idNumber",
    "bankName","accountNumber","accountName","accountType","bvn","tin",
    "providerFirstName","providerLastName","providerEmail","providerCountryCode","providerPhoneNumber","providerType",
    "providerLocation","providerBio","providerServiceCat","providerServiceName","providerServiceDesc","providerServiceType",
    "providerServicePrice","providerServiceDuration","providerServiceNumberOfPeople","providerYearsofExperience",
    "providerAreasofExpertise","providerCertification","providerCertificationIssuingOrg","providerCertificationYearObtained",
    "providerPortfolioLink","providerMinimumNoticeRequired","providerMaximumAdvanceBooking","providerResponseTime",
    "providerServiceArea","providerServiceAreaRadius","providerIdType","providerIdNumber","providerBankName",
    "providerAccountNumber","providerAccountName","providerAccountType","providerBvn","providerTin"
  ];
  scalarFields.forEach((key) => {
    if (Array.isArray(next[key])) next[key] = next[key][0] ?? "";
    else if (next[key] && typeof next[key] === "object" && !(next[key] instanceof File)) {
      next[key] = String(next[key].value ?? next[key].label ?? next[key].name ?? "");
    }
  });
  if (!Array.isArray(next.providerAreasServed)) {
    next.providerAreasServed = next.providerAreasServed ? [next.providerAreasServed] : [];
  } else {
    next.providerAreasServed = next.providerAreasServed.map((value) =>
      typeof value === "string" || typeof value === "number" ? String(value) : String(value?.value ?? value?.label ?? "")
    ).filter(Boolean);
  }
  const normalizeAssets = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
      if (!item) return null;
      if (typeof item === "string") return item;
      if (typeof File !== "undefined" && item instanceof File) return item;
      if (typeof item === "object") {
        if (item.url || item.publicId) {
          return {
            url: item.url || "",
            publicId: item.publicId || "",
            isPrimary: Boolean(item.isPrimary),
            name: item.name || "",
            mimeType: item.mimeType || item.type || "",
          };
        }
      }
      return null;
    }).filter(Boolean);
  };

  next.providerServiceImages = normalizeAssets(next.providerServiceImages);
  next.providerPortfolioMedia = normalizeAssets(next.providerPortfolioMedia);

  if (!Array.isArray(next.productTags)) next.productTags = next.productTags ? [next.productTags] : [];
  return next;
}


export function FormProvider({ children }) {
  const stored = loadStoredForms();
  const flow = sessionStorage.getItem("matchet_onboarding_flow") || "seller";
  const [formData, setFormData] = useState(() => ({
    // Initialize from fields here
    onboardingUserId: "",
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
    productImages: [],
    businessLogo: null,
    profileImage: null,
    idImageFront: null,
    idImageBack: null,
    selfieImage: null,
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
    providerServiceImages: [],
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
  }));
  if (stored[flow]) Object.assign(formData, normalizeOnboardingData(stored[flow]));

  const setOnboardingFlow = useCallback((nextFlow) => {
    const safeFlow = nextFlow === "service" ? "service" : "seller";
    sessionStorage.setItem("matchet_onboarding_flow", safeFlow);
    const saved = loadStoredForms()[safeFlow];
    setFormData((prev) => saved ? { ...prev, ...saved } : prev);
  }, []);

  const clearForm = useCallback(() => {
    const currentFlow = sessionStorage.getItem("matchet_onboarding_flow") || "seller";
    try { const all = loadStoredForms(); delete all[currentFlow]; sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(all)); } catch {}
    setFormData((prev) => { const next = { ...prev }; const isService = currentFlow === "service"; Object.keys(next).forEach((key) => { if (isService ? key.startsWith("provider") : !key.startsWith("provider")) next[key] = Array.isArray(next[key]) ? [] : key === "providerProfileImage" ? null : key === "providerAvailability" ? { monday:{enabled:false,startTime:"",endTime:""},tuesday:{enabled:false,startTime:"",endTime:""},wednesday:{enabled:false,startTime:"",endTime:""},thursday:{enabled:false,startTime:"",endTime:""},friday:{enabled:false,startTime:"",endTime:""},saturday:{enabled:false,startTime:"",endTime:""},sunday:{enabled:false,startTime:"",endTime:""} } : ""; }); return next; });
  }, []);

  const persistTimerRef = useRef(null);

  const schedulePersist = useCallback((next, flow) => {
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current);
    persistTimerRef.current = window.setTimeout(() => {
      try {
        const all = loadStoredForms();
        sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ ...all, [flow]: next }));
      } catch {}
    }, 250);
  }, []);

  useEffect(() => () => {
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current);
  }, []);

  // Update only the field being edited. The previous implementation normalized
  // and serialized the entire onboarding form on every keystroke, which made
  // controlled inputs lag and occasionally miss characters.
  const updateField = (name, value) => {
    setFormData((prevData) => {
      const next = { ...prevData, [name]: value };
      const flow = sessionStorage.getItem("matchet_onboarding_flow") || "seller";
      schedulePersist(next, flow);
      return next;
    });
  };

  const mergeFormData = useCallback((values) => {
    if (!values || typeof values !== "object") return;
    setFormData((prevData) => {
      const next = normalizeOnboardingData({ ...prevData, ...values });
      try {
        const all = loadStoredForms();
        const flow = sessionStorage.getItem("matchet_onboarding_flow") || "seller";
        sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ ...all, [flow]: next }));
      } catch {}
      return next;
    });
  }, []);

  return (
    <FormContext.Provider value={{ formData, updateField, mergeFormData, setOnboardingFlow, clearForm }}>
      {children}
    </FormContext.Provider>
  );
}

// Custom hook for easy access in the pages
export function useForm() {
  return useContext(FormContext);
}
