const express = require("express");
const requireAuth = require("../middleware/auth");
const {
  requireActiveProvider,
  requireActiveSeller,
} = require("../middleware/providerAccess");
const {
  getProducts,
  getProductById,
  getServices,
  getServiceById,
  getProviders,
  getProviderProfile,
  getStoreProfile,
  upsertProviderProfile,
  upsertStoreProfile,
  createProduct,
  createService,
} = require("../controllers/marketplace.controller");

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/services", getServices);
router.get("/providers", getProviders);
router.get("/services/:id", getServiceById);

router.get("/provider/profile", requireAuth, getProviderProfile);
router.post("/provider/profile", requireAuth, upsertProviderProfile);
router.post("/provider/services", requireAuth, requireActiveProvider, createService);

router.get("/seller/profile", requireAuth, getStoreProfile);
router.post("/seller/profile", requireAuth, upsertStoreProfile);
router.post("/seller/products", requireAuth, requireActiveSeller, createProduct);

module.exports = router;
