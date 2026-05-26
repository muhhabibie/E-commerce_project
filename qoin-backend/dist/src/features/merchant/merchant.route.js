"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const merchant_controller_1 = require("./merchant.controller");
const verifyToken_1 = require("../../middleware/verifyToken");
const merchant_schema_1 = require("./merchant.schema");
const validate_1 = require("../../middleware/validate");
const merchant_schema_2 = require("./merchant.schema");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Specific GET routes FIRST (before wildcard /:merchant_id)
router.get("/all-data", merchant_controller_1.getAllMerchant);
router.get("/display", merchant_controller_1.getDisplayMerchant);
router.get("/user", verifyToken_1.verifyToken, merchant_controller_1.getUserMerchant);
router.get("/type/:type", merchant_controller_1.getMerchantByType);
router.get("/top-100", merchant_controller_1.getTop100Merchants);
router.get("/ratings", merchant_controller_1.getAllRatings); // public: semua ulasan untuk landing page
router.get("/user-stats", verifyToken_1.verifyToken, merchant_controller_1.getUserStats); // stats: transaksi, favorit, ulasan
router.get("/follow-status/:merchant_id", verifyToken_1.verifyToken, merchant_controller_1.getMerchantFollowStatus);
router.get("/user/followed-merchant", verifyToken_1.verifyToken, merchant_controller_1.getLikedMerchant);
// Wildcard GET (must come after all specific GET routes)
router.get("/:merchant_id", merchant_controller_1.getMerchantById);
// POST routes
router.post("/:id/follow", verifyToken_1.verifyToken, merchant_controller_1.followMerchant);
router.post("/register", verifyToken_1.verifyToken, upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "banner_img", maxCount: 1 },
    { name: "gallery_photos", maxCount: 6 },
]), (0, validate_1.validate)(merchant_schema_1.addMerchantSchema, "body"), merchant_controller_1.addMerchant);
router.post("/rating/:merchant_id", verifyToken_1.verifyToken, (0, validate_1.validate)(merchant_schema_2.addMerchantRatingSchema, "body"), merchant_controller_1.addMerchantRating);
// DELETE routes
router.delete("/:id/unfollow", verifyToken_1.verifyToken, merchant_controller_1.unfollowMerchant);
router.delete("/delete/:id", verifyToken_1.verifyToken, merchant_controller_1.deleteMerchant);
exports.default = router;
