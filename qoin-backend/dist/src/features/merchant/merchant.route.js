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
router.post("/register", verifyToken_1.verifyToken, upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "banner_img", maxCount: 1 },
    { name: "gallery_photos", maxCount: 6 },
]), (0, validate_1.validate)(merchant_schema_1.addMerchantSchema, "body"), merchant_controller_1.addMerchant);
router.get("/:merchant_id", verifyToken_1.verifyToken, merchant_controller_1.getMerchantById);
router.post("/rating/:merchant_id", verifyToken_1.verifyToken, (0, validate_1.validate)(merchant_schema_2.addMerchantRatingSchema, "body"), merchant_controller_1.addMerchantRating);
exports.default = router;
