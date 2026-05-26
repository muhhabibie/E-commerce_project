import { Router } from "express";
import multer from "multer";
import {
  addMerchant,
  getMerchantById,
  addMerchantRating,
  getAllRatings,
  getUserStats,
  getAllMerchant,
  getUserMerchant,
  getDisplayMerchant,
  getMerchantByType,
  getMerchantFollowStatus,
  followMerchant,
  unfollowMerchant,
  getLikedMerchant,
  deleteMerchant,
  getTop100Merchants,
} from "./merchant.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { addMerchantSchema } from "./merchant.schema";
import { validate } from "../../middleware/validate";
import { addMerchantRatingSchema } from "./merchant.schema";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Specific GET routes FIRST (before wildcard /:merchant_id)
router.get("/all-data", getAllMerchant);
router.get("/display", getDisplayMerchant);
router.get("/user", verifyToken, getUserMerchant);
router.get("/type/:type", getMerchantByType);
router.get("/top-100", getTop100Merchants);
router.get("/ratings", getAllRatings); // public: semua ulasan untuk landing page
router.get("/user-stats", verifyToken, getUserStats); // stats: transaksi, favorit, ulasan
router.get("/follow-status/:merchant_id", verifyToken, getMerchantFollowStatus);
router.get("/user/followed-merchant", verifyToken, getLikedMerchant);

// Wildcard GET (must come after all specific GET routes)
router.get("/:merchant_id", getMerchantById);

// POST routes
router.post("/:id/follow", verifyToken, followMerchant);
router.post(
  "/register",
  verifyToken,
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "banner_img", maxCount: 1 },
    { name: "gallery_photos", maxCount: 6 },
  ]),
  validate(addMerchantSchema, "body"),
  addMerchant
);

router.post(
  "/rating/:merchant_id",
  verifyToken,
  validate(addMerchantRatingSchema, "body"),
  addMerchantRating
);

// DELETE routes
router.delete("/:id/unfollow", verifyToken, unfollowMerchant);
router.delete("/delete/:id", verifyToken, deleteMerchant);

export default router;
